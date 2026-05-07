import logging
import os
import re

import anthropic
from fastapi import APIRouter, HTTPException

from models.welcome import ChecklistItem, WelcomeRequest, WelcomeResponse
from services.claude import MODEL_ID, _client, parse_json_loose
from services.slack import post_to_slack

logger = logging.getLogger(__name__)

router = APIRouter()

SYSTEM_PROMPT = """You are a senior customer success specialist that writes onboarding emails
for new SaaS customers and produces a CSM-facing health read at the same time.

For every signup, return:
1. subject: a clear, warm subject line under 70 characters that uses the customer's first name.
2. email_body: the welcome email, UNDER 200 WORDS. Address by first name, congratulate them on
   joining the specific plan they signed up for, set expectations for the first week, and end with
   a single clear call to action that points to the FIRST WIN below.
3. checklist: an array of 3-5 ChecklistItem objects. Each item has:
   - step: a short imperative title (e.g. "Connect your Slack workspace") under 60 chars
   - why:  a one-sentence explanation of why this step matters for THIS plan
4. first_win: ONE sharp action sentence under 18 words, the highest-ROI activation moment for this
   plan tier. Examples: "Send your first AI-drafted reply within 24 hours", "Connect your contact
   form so the first lead lands in Slack tonight".
5. health_signal: one of "green" | "yellow" | "red".
   - green:  strong signals (clear product fit, named team size, named timeline, named integrations)
   - yellow: ambiguous signals or a small/trial plan with limited info
   - red:    weak signals (free / personal email, no company, vague intent — likely tyre-kicking)
6. health_reasoning: ONE sentence justifying the health signal — cite the actual signals.
7. day_7_followup_subject: a single short subject line teaser for the day-7 follow-up email
   (under 70 chars), tuned to the plan and likely first-week behaviour.

Respond ONLY with a JSON object in this exact format, no other text:
{
  "subject": "...",
  "email_body": "...",
  "checklist": [
    {"step": "...", "why": "..."},
    {"step": "...", "why": "..."}
  ],
  "first_win": "...",
  "health_signal": "green|yellow|red",
  "health_reasoning": "...",
  "day_7_followup_subject": "..."
}"""


def _word_count(text: str) -> int:
    return len(re.findall(r"\b\w+\b", text or ""))


def _mock_enabled() -> bool:
    return os.getenv("MOCK_CLASSIFIER", "").strip().lower() in ("1", "true", "yes")


def _classify_health(plan: str, company: str | None, email: str) -> tuple[str, str]:
    """Heuristic for the mock fallback. Real Claude call is much smarter."""
    plan_l = (plan or "").lower()
    enterprise = any(k in plan_l for k in ("enterprise", "business", "team", "pro", "growth"))
    paid = any(k in plan_l for k in ("pro", "business", "team", "growth", "enterprise", "annual"))
    free_email = any(email.lower().endswith(d) for d in ("@gmail.com", "@yahoo.com", "@hotmail.com", "@outlook.com"))

    if enterprise and company:
        return "green", "Enterprise-tier plan with named company — strong onboarding signal."
    if paid and company:
        return "green", "Paid plan with named company — clear product-fit signal."
    if paid or company:
        return "yellow", "Some signal (paid plan or named company) but missing the other."
    if free_email and not company:
        return "red", "Free-email signup with no company — tyre-kicker risk, prioritise activation."
    return "yellow", "Limited signals — onboard with a low-friction first win."


def _mock_draft(payload: WelcomeRequest) -> dict:
    first = payload.customer_name.strip().split()[0] if payload.customer_name.strip() else "there"
    plan = payload.product_plan
    company_line = f" at {payload.company}" if payload.company else ""
    health, health_reason = _classify_health(plan, payload.company, payload.email)

    body = (
        f"Hi {first},\n\n"
        f"Welcome to ClaraDesk! We are thrilled to have you{company_line} on the {plan} plan.\n\n"
        f"Over the next week, the goal is one thing — getting your first AI-drafted reply into "
        f"a real conversation with a real customer. Everything else flows from there.\n\n"
        f"Reply to this email with any questions and we will jump in.\n\n"
        f"Welcome aboard,\nThe ClaraDesk team"
    )

    return {
        "subject": f"Welcome to ClaraDesk, {first} — let's get your first reply out",
        "email_body": body,
        "checklist": [
            {
                "step": "Connect your Slack workspace",
                "why":  "All Clara drafts post to Slack — without it Clara has nowhere to deliver.",
            },
            {
                "step": "Pick the agent you want first",
                "why":  f"On the {plan} plan you can run Clara on the highest-friction inbox first.",
            },
            {
                "step": "Paste 3 of your best previous replies",
                "why":  "Clara studies tone and signoff style so drafts sound like your team.",
            },
            {
                "step": "Send the first AI-drafted reply",
                "why":  "Activation depends on this single moment — most teams do it in under an hour.",
            },
        ],
        "first_win": "Send your first AI-drafted reply to a real customer within 24 hours",
        "health_signal": health,
        "health_reasoning": health_reason,
        "day_7_followup_subject": f"How is week 1 going, {first}? Quick check-in",
    }


def _draft_for(payload: WelcomeRequest) -> dict:
    if _mock_enabled():
        logger.info("MOCK_CLASSIFIER enabled — using mock Onboarding Agent draft.")
        return _mock_draft(payload)

    user_message = (
        f"Customer: {payload.customer_name}\n"
        f"Email: {payload.email}\n"
        f"Company: {payload.company or '(not provided)'}\n"
        f"Plan: {payload.product_plan}"
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
        logger.warning("Anthropic API unavailable (%s) — falling back to mock Onboarding draft.", exc)
        return _mock_draft(payload)
    except ValueError as exc:
        # parse_json_loose raises json.JSONDecodeError (a ValueError subclass) on unparseable text
        logger.warning("Onboarding response not valid JSON (%s) — falling back to mock.", exc)
        return _mock_draft(payload)


def _coerce_checklist(raw: list) -> list[ChecklistItem]:
    out: list[ChecklistItem] = []
    for item in raw or []:
        if not isinstance(item, dict):
            continue
        step = str(item.get("step", "")).strip()
        why = str(item.get("why", "")).strip()
        if not step or not why:
            continue
        out.append(ChecklistItem(step=step[:120], why=why[:240]))
    return out[:6]


@router.post("/draft", response_model=WelcomeResponse)
def draft(payload: WelcomeRequest) -> WelcomeResponse:
    try:
        result = _draft_for(payload)
    except Exception as exc:
        logger.exception("Onboarding draft failed")
        raise HTTPException(status_code=502, detail=f"Onboarding draft failed: {exc}")

    subject = str(result.get("subject", ""))[:200]
    email_body = str(result.get("email_body", ""))
    checklist = _coerce_checklist(result.get("checklist") or [])
    first_win = str(result.get("first_win", ""))[:240]

    health_signal = result.get("health_signal", "yellow")
    if health_signal not in ("green", "yellow", "red"):
        health_signal = "yellow"
    health_reasoning = str(result.get("health_reasoning", ""))
    day_7 = str(result.get("day_7_followup_subject", ""))[:200]

    if not checklist:
        checklist = _coerce_checklist(_mock_draft(payload)["checklist"])

    word_count = _word_count(email_body)
    health_emoji = {"green": "🟢", "yellow": "🟡", "red": "🔴"}[health_signal]

    slack_posted = post_to_slack(
        webhook_env_key="SLACK_ONBOARDING_WEBHOOK",
        title=f"{health_emoji} New signup — {payload.customer_name} · {payload.product_plan}",
        fields={
            "Customer":    f"{payload.customer_name} <{payload.email}>",
            "Company":     payload.company or "—",
            "Plan":        payload.product_plan,
            "Health":      f"{health_signal} · {health_reasoning}",
            "First win":   first_win or "—",
            "Day-7 nudge": day_7 or "—",
            "Subject":     subject,
        },
        extra_text=f"*Welcome email ({word_count} words):*\n{email_body}",
        context="AI draft · review and send · ClaraDesk Onboarding Agent",
    )

    return WelcomeResponse(
        subject=subject,
        email_body=email_body,
        word_count=word_count,
        checklist=checklist,
        first_win=first_win,
        health_signal=health_signal,
        health_reasoning=health_reasoning,
        day_7_followup_subject=day_7,
        slack_posted=slack_posted,
    )
