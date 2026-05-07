import json
import logging
import os
import re

import anthropic
from fastapi import APIRouter, HTTPException

from models.leads import EmailVariant, LeadsRequest, LeadsResponse
from services.claude import MODEL_ID, _client, parse_json_loose
from services.slack import post_to_slack

logger = logging.getLogger(__name__)

router = APIRouter()

SYSTEM_PROMPT = """You are a senior sales assistant that writes personalised follow-up emails
for inbound leads.

For every inquiry, return:
1. lead_score: one of "hot" | "warm" | "cold"
   - hot:  buying intent, urgency, budget signals, specific volume/timeline mentioned
   - warm: clear interest, evaluating, asking informed questions, no urgency yet
   - cold: vague, generic, low intent, possibly tyre-kicking
2. score_reasoning: ONE sentence explaining the score
3. intent_tags: 2-5 short snake_case tags. Use compact key:value when relevant
   (examples: "pricing", "demo_request", "team_size:25", "timeline:this_quarter",
   "competitor_mentioned", "integration_question"). Lowercase only.
4. next_action: ONE actionable instruction for the salesperson under 12 words
   (examples: "Book a 15-min discovery call this week", "Send pricing PDF and case study",
   "Tag as nurture, follow up in 30 days").
5. variants: TWO email drafts — one with tone "friendly", one with tone "professional".
   Each draft has:
   - subject: a clear subject line under 70 characters
   - email_body: the full email body, UNDER 150 WORDS, addressing the prospect by first name,
     referencing their specific need, ending with a single clear call to action
   - word_count: integer count of words in email_body

Respond ONLY with a JSON object in this exact format, no other text:
{
  "lead_score": "hot|warm|cold",
  "score_reasoning": "one sentence",
  "intent_tags": ["tag1", "tag2"],
  "next_action": "one sharp instruction",
  "variants": [
    {"tone": "friendly",     "subject": "...", "email_body": "...", "word_count": 0},
    {"tone": "professional", "subject": "...", "email_body": "...", "word_count": 0}
  ]
}"""


HOT_KEYWORDS = (
    "buy", "purchase", "pricing", "price", "quote", "demo today", "this week", "this quarter",
    "asap", "urgent", "budget approved", "need by", "decision maker", "rfp",
)
WARM_KEYWORDS = (
    "demo", "trial", "evaluate", "interested", "looking at", "considering",
    "compare", "options", "case study", "integration", "features",
)


def _word_count(text: str) -> int:
    return len(re.findall(r"\b\w+\b", text or ""))


def _mock_enabled() -> bool:
    return os.getenv("MOCK_CLASSIFIER", "").strip().lower() in ("1", "true", "yes")


def _mock_draft(name: str, inquiry: str, company: str | None) -> dict:
    text = inquiry.lower()
    first = name.strip().split()[0] if name.strip() else "there"

    hot_hits = sum(1 for kw in HOT_KEYWORDS if kw in text)
    warm_hits = sum(1 for kw in WARM_KEYWORDS if kw in text)

    if hot_hits >= 2:
        score, reasoning = "hot", "Mock: strong urgency or buying-signal keywords detected."
    elif hot_hits == 1 or warm_hits >= 2:
        score, reasoning = "warm", "Mock: clear interest signals without firm urgency."
    else:
        score, reasoning = "cold", "Mock: low-intent or generic inquiry."

    tags = []
    if any(k in text for k in ("price", "pricing", "quote", "cost")):
        tags.append("pricing")
    if "demo" in text:
        tags.append("demo_request")
    if "trial" in text:
        tags.append("trial_request")
    if "integrat" in text:
        tags.append("integration_question")
    if not tags:
        tags = ["general_inquiry"]

    next_action = {
        "hot":  "Book a 15-min discovery call within 24 hours",
        "warm": "Send pricing and a relevant case study",
        "cold": "Tag as nurture, follow up in 30 days",
    }[score]

    company_line = f" at {company}" if company else ""
    friendly_body = (
        f"Hi {first}, thanks so much for reaching out{company_line}! "
        f"I'd love to hear more about what you're trying to solve. "
        f"Happy to jump on a quick 15-min call this week to talk through it — "
        f"would Tuesday or Thursday work for you?\n\n"
        f"Either way, I'm here when you need me.\n\nBest,\nThe Sales Team"
    )
    professional_body = (
        f"Hi {first},\n\nThank you for your enquiry{company_line}. "
        f"Based on your message I've put together some next steps and would welcome a brief call "
        f"to walk through them. Please share a few times that work this week and I'll send an invite.\n\n"
        f"Kind regards,\nThe Sales Team"
    )

    return {
        "lead_score": score,
        "score_reasoning": reasoning,
        "intent_tags": tags,
        "next_action": next_action,
        "variants": [
            {
                "tone": "friendly",
                "subject": f"Quick chat about your enquiry, {first}?",
                "email_body": friendly_body,
                "word_count": _word_count(friendly_body),
            },
            {
                "tone": "professional",
                "subject": f"Following up on your enquiry{company_line}",
                "email_body": professional_body,
                "word_count": _word_count(professional_body),
            },
        ],
    }


def _draft_for(payload: LeadsRequest) -> dict:
    if _mock_enabled():
        logger.info("MOCK_CLASSIFIER enabled — using mock Lead Agent draft.")
        return _mock_draft(payload.name, payload.inquiry_details, payload.company)

    user_message = (
        f"Name: {payload.name}\n"
        f"Email: {payload.email}\n"
        f"Company: {payload.company or '(not provided)'}\n"
        f"Inquiry:\n{payload.inquiry_details}"
    )

    try:
        response = _client().messages.create(
            model=MODEL_ID,
            max_tokens=1500,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_message}],
        )
        return parse_json_loose(response.content[0].text)
    except (anthropic.APIError, anthropic.APIConnectionError, json.JSONDecodeError) as exc:
        logger.warning("Anthropic API unavailable (%s) — falling back to mock Lead draft.", exc)
        return _mock_draft(payload.name, payload.inquiry_details, payload.company)


def _coerce_variants(raw_variants: list) -> list[EmailVariant]:
    """Trust Claude but recompute word_count and clamp to known tones."""
    out: list[EmailVariant] = []
    for v in raw_variants or []:
        tone = v.get("tone")
        if tone not in ("friendly", "professional"):
            continue
        body = v.get("email_body", "")
        out.append(EmailVariant(
            tone=tone,
            subject=v.get("subject", "")[:120],
            email_body=body,
            word_count=_word_count(body),
        ))
    return out


@router.post("/draft", response_model=LeadsResponse)
def draft(payload: LeadsRequest) -> LeadsResponse:
    try:
        result = _draft_for(payload)
    except Exception as exc:
        logger.exception("Lead draft failed")
        raise HTTPException(status_code=502, detail=f"Lead draft failed: {exc}")

    lead_score = result.get("lead_score", "warm")
    if lead_score not in ("hot", "warm", "cold"):
        lead_score = "warm"

    score_reasoning = result.get("score_reasoning", "")
    intent_tags = [str(t) for t in (result.get("intent_tags") or [])][:8]
    next_action = result.get("next_action", "")
    variants = _coerce_variants(result.get("variants") or [])

    if not variants:
        # Final safety net: build a simple variant pair so the UI never sees an empty array.
        fallback = _mock_draft(payload.name, payload.inquiry_details, payload.company)
        variants = _coerce_variants(fallback["variants"])

    primary = next((v for v in variants if v.tone == "friendly"), variants[0])
    score_emoji = {"hot": "🔥", "warm": "🌤", "cold": "❄️"}[lead_score]

    slack_posted = post_to_slack(
        webhook_env_key="SLACK_LEADS_WEBHOOK",
        title=f"{score_emoji} New {lead_score.upper()} lead — {payload.name}",
        fields={
            "Lead":         f"{payload.name} <{payload.email}>",
            "Company":      payload.company or "—",
            "Score":        f"{lead_score} · {score_reasoning}",
            "Next action":  next_action or "—",
            "Tags":         ", ".join(intent_tags) if intent_tags else "—",
            "Subject":      primary.subject,
        },
        extra_text=f"*Suggested reply (friendly · {primary.word_count} words):*\n{primary.email_body}",
        context=f"AI draft · review and send · ClaraDesk Lead Agent",
    )

    return LeadsResponse(
        lead_score=lead_score,
        score_reasoning=score_reasoning,
        intent_tags=intent_tags,
        next_action=next_action,
        variants=variants,
        slack_posted=slack_posted,
    )
