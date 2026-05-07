import logging
import os
import re

import anthropic
from fastapi import APIRouter, HTTPException

from models.reviews import ReviewsRequest, ReviewsResponse, RootIssue
from services.claude import MODEL_ID, _client, parse_json_loose
from services.slack import post_to_slack

logger = logging.getLogger(__name__)

router = APIRouter()

SYSTEM_PROMPT = """You are a senior reputation-management assistant for a customer-facing business.

For every negative review, return:
1. public_response: UNDER 100 WORDS, professional and empathetic, suitable to post publicly on
   the review platform. Address the reviewer by first name. Acknowledge specific issues from
   the review (do not be generic). Briefly state what is being done. Offer a private follow-up
   channel. Sign off as "The Team" — never invent a manager's name.
2. internal_note: 2-3 sentences for the team summarising what happened, flagging compliance,
   safety or legal concerns if any.
3. root_issues: an array of 1-4 RootIssue objects. Each has:
   - issue: a short string describing the underlying problem
   - suggested_owner: ONE of "frontdesk" | "kitchen" | "support" | "billing" | "mgmt" | "ops" | "other"
4. severity: "mild" | "moderate" | "severe".
   - mild:     low-key complaint, easy fix, no reputation risk
   - moderate: real frustration, multiple issues, public visibility matters
   - severe:   safety/health/legal/discrimination/dishonesty themes, or visible escalation pattern
5. severity_reasoning: ONE sentence justifying the severity.
6. suggested_compensation: optional short string describing a reasonable offer
   (e.g. "25% off next visit + personal call from manager", "Refund the meal cost").
   Empty string if no compensation is appropriate.

Respond ONLY with a JSON object in this exact format, no other text:
{
  "public_response": "...",
  "internal_note": "...",
  "root_issues": [{"issue": "...", "suggested_owner": "..."}],
  "severity": "mild|moderate|severe",
  "severity_reasoning": "...",
  "suggested_compensation": "..."
}"""


VALID_OWNERS = ("frontdesk", "kitchen", "support", "billing", "mgmt", "ops", "other")
SEVERE_KEYWORDS = (
    "unsafe", "unhygienic", "discriminat", "racist", "harass", "stole", "lawsuit",
    "lawyer", "illegal", "dangerous", "ill", "sick", "injured", "fraud", "scam",
)
MODERATE_KEYWORDS = ("rude", "dirty", "wait", "ignored", "overcharged", "wrong order", "broken")


def _word_count(text: str) -> int:
    return len(re.findall(r"\b\w+\b", text or ""))


def _mock_enabled() -> bool:
    return os.getenv("MOCK_CLASSIFIER", "").strip().lower() in ("1", "true", "yes")


def _classify_severity(rating: int, review_text: str) -> tuple[str, str]:
    text = review_text.lower()
    if any(k in text for k in SEVERE_KEYWORDS):
        return "severe", "Review contains safety/legal/health-risk language — escalate immediately."
    if rating == 1 or any(k in text for k in MODERATE_KEYWORDS):
        return "moderate", "Multiple specific complaints visible — meaningful reputation risk."
    return "mild", "Single low-key complaint — straightforward to acknowledge and address."


def _mock_draft(payload: ReviewsRequest) -> dict:
    first = payload.reviewer_name.strip().split()[0] if payload.reviewer_name.strip() else "there"
    severity, reasoning = _classify_severity(payload.rating, payload.review_text)

    public = (
        f"Hi {first}, thank you for taking the time to share this — and we are sorry your "
        f"experience fell short of what you should expect from us. Your specific feedback "
        f"about this visit has been shared with the team and we are looking at the issues you "
        f"raised today. We would love to make this right — please reach out at our contact "
        f"page so we can speak directly.\n\nThank you,\nThe Team"
    )

    internal = (
        f"{payload.platform.title()} {payload.rating}-star review from {payload.reviewer_name}. "
        f"Severity {severity}. Action items assigned below — please respond before posting "
        f"the public reply."
    )

    issues = [
        {"issue": "Review highlights service-quality gap", "suggested_owner": "mgmt"},
    ]
    if "wait" in payload.review_text.lower() or "slow" in payload.review_text.lower():
        issues.append({"issue": "Wait time / staffing issue raised", "suggested_owner": "frontdesk"})
    if "rude" in payload.review_text.lower() or "ignored" in payload.review_text.lower():
        issues.append({"issue": "Staff conduct concern", "suggested_owner": "mgmt"})

    compensation = ""
    if severity == "severe":
        compensation = "Full refund + personal call from manager + complimentary visit"
    elif severity == "moderate":
        compensation = "25% off next visit + personal apology"

    return {
        "public_response": public,
        "internal_note": internal,
        "root_issues": issues,
        "severity": severity,
        "severity_reasoning": reasoning,
        "suggested_compensation": compensation,
    }


def _draft_for(payload: ReviewsRequest) -> dict:
    if _mock_enabled():
        logger.info("MOCK_CLASSIFIER enabled — using mock Review Agent draft.")
        return _mock_draft(payload)

    user_message = (
        f"Reviewer: {payload.reviewer_name}\n"
        f"Platform: {payload.platform}\n"
        f"Rating: {payload.rating} stars\n"
        f"Review:\n{payload.review_text}"
    )

    try:
        response = _client().messages.create(
            model=MODEL_ID,
            max_tokens=1500,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_message}],
        )
        return parse_json_loose(response.content[0].text)
    except (anthropic.APIError, anthropic.APIConnectionError) as exc:
        logger.warning("Anthropic API unavailable (%s) — falling back to mock Review draft.", exc)
        return _mock_draft(payload)
    except ValueError as exc:
        logger.warning("Review response not valid JSON (%s) — falling back to mock.", exc)
        return _mock_draft(payload)


def _coerce_root_issues(raw: list) -> list[RootIssue]:
    out: list[RootIssue] = []
    for item in raw or []:
        if not isinstance(item, dict):
            continue
        issue = str(item.get("issue", "")).strip()
        owner = item.get("suggested_owner", "other")
        if owner not in VALID_OWNERS:
            owner = "other"
        if not issue:
            continue
        out.append(RootIssue(issue=issue[:200], suggested_owner=owner))
    return out[:6]


@router.post("/draft", response_model=ReviewsResponse)
def draft(payload: ReviewsRequest) -> ReviewsResponse:
    try:
        result = _draft_for(payload)
    except Exception as exc:
        logger.exception("Review draft failed")
        raise HTTPException(status_code=502, detail=f"Review draft failed: {exc}")

    public_response = str(result.get("public_response", ""))
    internal_note = str(result.get("internal_note", ""))
    root_issues = _coerce_root_issues(result.get("root_issues") or [])

    severity = result.get("severity", "moderate")
    if severity not in ("mild", "moderate", "severe"):
        severity = "moderate"
    severity_reasoning = str(result.get("severity_reasoning", ""))
    compensation = str(result.get("suggested_compensation", "")).strip()

    if not root_issues:
        root_issues = _coerce_root_issues(_mock_draft(payload)["root_issues"])

    public_words = _word_count(public_response)
    severity_emoji = {"mild": "🟢", "moderate": "🟡", "severe": "🔴"}[severity]
    stars = "★" * payload.rating + "☆" * (5 - payload.rating)

    issues_block = "\n".join(
        f"• *{i.issue}*  →  owner: `{i.suggested_owner}`" for i in root_issues
    )

    slack_posted = post_to_slack(
        webhook_env_key="SLACK_REVIEWS_WEBHOOK",
        title=f"{severity_emoji} {severity.upper()} review · {payload.platform} · {stars}",
        fields={
            "Reviewer":     payload.reviewer_name,
            "Platform":     payload.platform,
            "Rating":       f"{payload.rating} / 5  {stars}",
            "Severity":     f"{severity} · {severity_reasoning}",
            "Compensation": compensation or "—",
        },
        extra_text=(
            f"*Original review:*\n>{payload.review_text}\n\n"
            f"*Public response ({public_words} words):*\n{public_response}\n\n"
            f"*Internal note:*\n{internal_note}\n\n"
            f"*Root issues:*\n{issues_block}"
        ),
        context="AI draft · review before posting · ClaraDesk Review Agent",
    )

    return ReviewsResponse(
        public_response=public_response,
        public_word_count=public_words,
        internal_note=internal_note,
        root_issues=root_issues,
        severity=severity,
        severity_reasoning=severity_reasoning,
        suggested_compensation=compensation,
        slack_posted=slack_posted,
    )
