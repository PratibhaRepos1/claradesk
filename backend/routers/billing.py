import logging
import os
import re

import anthropic
from fastapi import APIRouter, HTTPException

from models.billing import BillingRequest, BillingResponse
from services.claude import MODEL_ID, _client, parse_json_loose
from services.slack import post_to_slack

logger = logging.getLogger(__name__)

router = APIRouter()

SYSTEM_PROMPT = """You are a senior accounts-receivable assistant that drafts payment-reminder emails.

For every overdue invoice, return:
1. subject: a subject line under 70 chars referencing the invoice number.
2. email_body: UNDER 100 WORDS. Address by first name, state the invoice number and amount
   directly, end with a single clear call to action (e.g. "reply with a payment date" or
   "use the payment link below"). Do not include a placeholder URL — the rep adds that.
3. tone: one of "friendly" | "direct" | "firm". Calibrate to days_overdue:
   - 1-7  days  → friendly  (light reminder, assume oversight)
   - 8-21 days  → direct    (clear, no fluff, mention escalation if not paid soon)
   - 22+  days  → firm      (formal, reference next steps such as collections)
4. recovery_probability: "high" | "medium" | "low" — likelihood of payment within 14 days
   based on days_overdue and the amount.
5. recovery_reasoning: ONE sentence justifying the probability.
6. payment_plan_offer: optional string suggesting concession text the rep COULD include
   (e.g. "Happy to split this across two months if that helps"). Empty string if none needed.

Respond ONLY with a JSON object in this exact format, no other text:
{
  "subject": "...",
  "email_body": "...",
  "tone": "friendly|direct|firm",
  "recovery_probability": "high|medium|low",
  "recovery_reasoning": "...",
  "payment_plan_offer": "..."
}"""


def _word_count(text: str) -> int:
    return len(re.findall(r"\b\w+\b", text or ""))


def _mock_enabled() -> bool:
    return os.getenv("MOCK_CLASSIFIER", "").strip().lower() in ("1", "true", "yes")


def _tone_for(days: int) -> str:
    if days <= 7:
        return "friendly"
    if days <= 21:
        return "direct"
    return "firm"


def _probability_for(days: int, amount: float) -> tuple[str, str]:
    if days <= 7:
        return "high", "Within first week — typical oversight, recovery rate is high."
    if days <= 21:
        return "medium", "Past two weeks overdue — recovery still likely with a direct nudge."
    if days <= 45:
        return "low", "Over three weeks overdue — escalation pattern, lower recovery rate."
    return "low", f"More than {days} days overdue — formal collections may be required."


def _mock_draft(payload: BillingRequest) -> dict:
    first = payload.customer_name.strip().split()[0] if payload.customer_name.strip() else "there"
    tone = _tone_for(payload.days_overdue)
    prob, reasoning = _probability_for(payload.days_overdue, payload.amount)

    if tone == "friendly":
        subject = f"Quick reminder · invoice {payload.invoice_number}"
        body = (
            f"Hi {first},\n\nJust a friendly nudge — invoice {payload.invoice_number} for "
            f"${payload.amount:,.2f} is now {payload.days_overdue} days past due. "
            f"Easily missed. Could you reply with a payment date when you have a moment?\n\n"
            f"Thanks!\nThe Billing Team"
        )
    elif tone == "direct":
        subject = f"Payment overdue · invoice {payload.invoice_number}"
        body = (
            f"Hi {first},\n\nInvoice {payload.invoice_number} for ${payload.amount:,.2f} is now "
            f"{payload.days_overdue} days past due. Please reply today with a payment date or "
            f"complete payment via the link below. We want to avoid moving this to collections.\n\n"
            f"Best,\nThe Billing Team"
        )
    else:  # firm
        subject = f"FINAL NOTICE · invoice {payload.invoice_number}"
        body = (
            f"Dear {first},\n\nInvoice {payload.invoice_number} ($"
            f"{payload.amount:,.2f}) is now {payload.days_overdue} days past due. "
            f"Without payment or a confirmed payment plan within 7 days, this account will be "
            f"escalated to formal collections.\n\nRegards,\nThe Billing Team"
        )

    plan_offer = ""
    if payload.days_overdue >= 14 and payload.amount >= 1000:
        plan_offer = "Happy to split this across two monthly payments if that helps cashflow."

    return {
        "subject": subject,
        "email_body": body,
        "tone": tone,
        "recovery_probability": prob,
        "recovery_reasoning": reasoning,
        "payment_plan_offer": plan_offer,
    }


def _draft_for(payload: BillingRequest) -> dict:
    if _mock_enabled():
        logger.info("MOCK_CLASSIFIER enabled — using mock Billing Agent draft.")
        return _mock_draft(payload)

    user_message = (
        f"Customer: {payload.customer_name} <{payload.customer_email}>\n"
        f"Invoice: {payload.invoice_number}\n"
        f"Amount: ${payload.amount:,.2f}\n"
        f"Days overdue: {payload.days_overdue}"
    )

    try:
        response = _client().messages.create(
            model=MODEL_ID,
            max_tokens=900,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_message}],
        )
        return parse_json_loose(response.content[0].text)
    except (anthropic.APIError, anthropic.APIConnectionError) as exc:
        logger.warning("Anthropic API unavailable (%s) — falling back to mock Billing draft.", exc)
        return _mock_draft(payload)
    except ValueError as exc:
        logger.warning("Billing response not valid JSON (%s) — falling back to mock.", exc)
        return _mock_draft(payload)


@router.post("/nudge", response_model=BillingResponse)
def nudge(payload: BillingRequest) -> BillingResponse:
    try:
        result = _draft_for(payload)
    except Exception as exc:
        logger.exception("Billing nudge failed")
        raise HTTPException(status_code=502, detail=f"Billing nudge failed: {exc}")

    # Server enforces tone-by-days rule even if Claude drifts
    expected_tone = _tone_for(payload.days_overdue)
    tone = result.get("tone", expected_tone)
    if tone not in ("friendly", "direct", "firm"):
        tone = expected_tone

    subject = str(result.get("subject", ""))[:200]
    email_body = str(result.get("email_body", ""))
    prob = result.get("recovery_probability", "medium")
    if prob not in ("high", "medium", "low"):
        prob = "medium"
    reasoning = str(result.get("recovery_reasoning", ""))
    plan_offer = str(result.get("payment_plan_offer", "")).strip()

    word_count = _word_count(email_body)
    tone_emoji = {"friendly": "🙂", "direct": "📌", "firm": "⚠️"}[tone]

    slack_posted = post_to_slack(
        webhook_env_key="SLACK_BILLING_WEBHOOK",
        title=f"{tone_emoji} Overdue invoice — {payload.invoice_number} · ${payload.amount:,.2f}",
        fields={
            "Customer":     f"{payload.customer_name} <{payload.customer_email}>",
            "Invoice":      payload.invoice_number,
            "Amount":       f"${payload.amount:,.2f}",
            "Days overdue": str(payload.days_overdue),
            "Tone":         tone,
            "Recovery":     f"{prob} · {reasoning}",
            "Plan offer":   plan_offer or "—",
            "Subject":      subject,
        },
        extra_text=f"*Reminder draft ({word_count} words · {tone}):*\n{email_body}",
        context="AI draft · review and send · ClaraDesk Billing Agent",
    )

    return BillingResponse(
        subject=subject,
        email_body=email_body,
        word_count=word_count,
        tone=tone,
        recovery_probability=prob,
        recovery_reasoning=reasoning,
        payment_plan_offer=plan_offer,
        slack_posted=slack_posted,
    )
