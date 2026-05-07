import logging
import os
import re

import anthropic
from fastapi import APIRouter, HTTPException

from models.bookings import BookingsRequest, BookingsResponse
from services.claude import MODEL_ID, _client, parse_json_loose
from services.slack import post_to_slack

logger = logging.getLogger(__name__)

router = APIRouter()

SYSTEM_PROMPT = """You are a senior customer-retention assistant for a service-based booking
business (salon, clinic, studio, agency, etc.).

For every cancellation, return:
1. message_body: a warm win-back email UNDER 120 WORDS. Address by first name, briefly
   acknowledge the cancellation reason without being preachy, offer a clear path to reschedule,
   and end with one simple call to action. Do not invent specific dates — keep time slots
   generic ("Tuesday morning", "early next week").
2. suggested_times: array of 2-4 short generic time-slot strings.
3. sms_variant: a one-or-two sentence SMS version under 160 characters total — same goal,
   shorter, casual.
4. tone: "warm" | "professional".
5. winback_probability: "high" | "medium" | "low" — chance of rebooking within 30 days,
   based on the cancellation reason and booking history.
6. winback_reasoning: ONE sentence justifying the probability.
7. cancellation_category: one of:
   - "schedule_conflict": time clash, illness, travel, family
   - "dissatisfaction":   complaints about service, price, staff
   - "financial":         cost concerns, layoffs, business slowdown
   - "external":          weather, transport, third-party cancellation
   - "other":             unclear or mixed
8. risk_factors: array of 0-3 short strings flagging concerns the rep should know
   (e.g. "third cancellation in 6 months", "previously complained about pricing",
   "no-show pattern"). Empty array if no risks visible from history.

Respond ONLY with a JSON object in this exact format, no other text:
{
  "message_body": "...",
  "suggested_times": ["...", "..."],
  "sms_variant": "...",
  "tone": "warm|professional",
  "winback_probability": "high|medium|low",
  "winback_reasoning": "...",
  "cancellation_category": "schedule_conflict|dissatisfaction|financial|external|other",
  "risk_factors": ["...", "..."]
}"""


SCHEDULE_KEYWORDS = ("conflict", "schedule", "travel", "sick", "ill", "family", "work", "busy", "meeting")
DISSATISFACTION_KEYWORDS = ("rude", "bad service", "disappointed", "complaint", "expensive", "overpriced", "quality")
FINANCIAL_KEYWORDS = ("cost", "money", "afford", "budget", "layoff", "expensive", "tight")
EXTERNAL_KEYWORDS = ("weather", "storm", "snow", "traffic", "transport", "flight", "train")


def _word_count(text: str) -> int:
    return len(re.findall(r"\b\w+\b", text or ""))


def _mock_enabled() -> bool:
    return os.getenv("MOCK_CLASSIFIER", "").strip().lower() in ("1", "true", "yes")


def _categorize(reason: str) -> str:
    r = reason.lower()
    if any(k in r for k in DISSATISFACTION_KEYWORDS):
        return "dissatisfaction"
    if any(k in r for k in FINANCIAL_KEYWORDS):
        return "financial"
    if any(k in r for k in EXTERNAL_KEYWORDS):
        return "external"
    if any(k in r for k in SCHEDULE_KEYWORDS):
        return "schedule_conflict"
    return "other"


def _mock_draft(payload: BookingsRequest) -> dict:
    first = payload.customer_name.strip().split()[0] if payload.customer_name.strip() else "there"
    category = _categorize(payload.cancellation_reason)

    history = (payload.booking_history or "").lower()
    repeat_canceller = any(s in history for s in ("cancel", "no-show", "noshow", "missed"))

    if category == "dissatisfaction":
        prob, reason = "low", "Cancellation cites dissatisfaction — reschedule alone may not recover."
        tone = "professional"
    elif category == "financial":
        prob, reason = "medium", "Cost is the blocker — a small concession could rebook."
        tone = "warm"
    elif category in ("schedule_conflict", "external"):
        prob, reason = "high", "Logistics-driven cancellation — easy to rebook with flexible options."
        tone = "warm"
    else:
        prob, reason = "medium", "Unclear cause — assume neutral and offer easy reschedule."
        tone = "warm"

    risk = []
    if repeat_canceller:
        risk.append("Multiple cancellations in booking history")
    if category == "dissatisfaction":
        risk.append("Cancelled citing dissatisfaction — flag for manager review")

    body = (
        f"Hi {first},\n\nWe were sorry to hear about the cancellation of your "
        f"{payload.service_type} on {payload.original_date}. Things come up — completely understand.\n\n"
        f"When you are ready to rebook, we have spots opening up early next week and on "
        f"Friday afternoon. Just reply with what works and we will lock it in.\n\n"
        f"Looking forward to seeing you again,\nThe Team"
    )

    sms = (
        f"Hi {first}! Sorry your {payload.service_type} got cancelled. "
        f"Want to rebook for early next week? Just reply with a time that works."
    )

    return {
        "message_body": body,
        "suggested_times": ["Early next week", "Friday afternoon", "Saturday morning"],
        "sms_variant": sms[:160],
        "tone": tone,
        "winback_probability": prob,
        "winback_reasoning": reason,
        "cancellation_category": category,
        "risk_factors": risk,
    }


def _draft_for(payload: BookingsRequest) -> dict:
    if _mock_enabled():
        logger.info("MOCK_CLASSIFIER enabled — using mock Booking Agent draft.")
        return _mock_draft(payload)

    user_message = (
        f"Customer: {payload.customer_name}\n"
        f"Service: {payload.service_type}\n"
        f"Original date: {payload.original_date}\n"
        f"Cancellation reason: {payload.cancellation_reason}\n"
        f"Booking history: {payload.booking_history or '(none provided)'}"
    )

    try:
        response = _client().messages.create(
            model=MODEL_ID,
            max_tokens=1300,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_message}],
        )
        return parse_json_loose(response.content[0].text)
    except (anthropic.APIError, anthropic.APIConnectionError) as exc:
        logger.warning("Anthropic API unavailable (%s) — falling back to mock Booking draft.", exc)
        return _mock_draft(payload)
    except ValueError as exc:
        logger.warning("Booking response not valid JSON (%s) — falling back to mock.", exc)
        return _mock_draft(payload)


VALID_CATEGORIES = ("schedule_conflict", "dissatisfaction", "financial", "external", "other")


@router.post("/winback", response_model=BookingsResponse)
def winback(payload: BookingsRequest) -> BookingsResponse:
    try:
        result = _draft_for(payload)
    except Exception as exc:
        logger.exception("Booking winback failed")
        raise HTTPException(status_code=502, detail=f"Booking winback failed: {exc}")

    message_body = str(result.get("message_body", ""))
    suggested_times = [str(t) for t in (result.get("suggested_times") or [])][:6]
    sms_variant = str(result.get("sms_variant", ""))[:160]
    tone = result.get("tone", "warm")
    if tone not in ("warm", "professional"):
        tone = "warm"
    prob = result.get("winback_probability", "medium")
    if prob not in ("high", "medium", "low"):
        prob = "medium"
    reasoning = str(result.get("winback_reasoning", ""))
    category = result.get("cancellation_category", "other")
    if category not in VALID_CATEGORIES:
        category = "other"
    risk_factors = [str(r) for r in (result.get("risk_factors") or [])][:5]

    word_count = _word_count(message_body)
    prob_emoji = {"high": "🟢", "medium": "🟡", "low": "🔴"}[prob]

    slack_posted = post_to_slack(
        webhook_env_key="SLACK_BOOKINGS_WEBHOOK",
        title=f"{prob_emoji} Cancelled booking — {payload.customer_name} · {payload.service_type}",
        fields={
            "Customer":      payload.customer_name,
            "Service":       payload.service_type,
            "Original date": payload.original_date,
            "Reason":        payload.cancellation_reason[:200],
            "Category":      category,
            "Win-back":      f"{prob} · {reasoning}",
            "Risks":         "; ".join(risk_factors) if risk_factors else "—",
            "Suggested times": ", ".join(suggested_times) if suggested_times else "—",
        },
        extra_text=(
            f"*Win-back email ({word_count} words · {tone}):*\n{message_body}\n\n"
            f"*SMS variant:*\n{sms_variant}"
        ),
        context="AI draft · review and send · ClaraDesk Booking Agent",
    )

    return BookingsResponse(
        message_body=message_body,
        word_count=word_count,
        suggested_times=suggested_times,
        sms_variant=sms_variant,
        tone=tone,
        winback_probability=prob,
        winback_reasoning=reasoning,
        cancellation_category=category,
        risk_factors=risk_factors,
        slack_posted=slack_posted,
    )
