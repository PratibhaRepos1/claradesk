import json
import logging
import os

import anthropic
from fastapi import APIRouter, HTTPException

from models.inbox import InboxRequest, InboxResponse
from services.claude import MODEL_ID, _client
from services.slack import post_to_slack

logger = logging.getLogger(__name__)

router = APIRouter()

SYSTEM_PROMPT = """You are a contact form classifier for a business website.

Classify the incoming message into exactly ONE of these categories:
- sales: interested in buying, pricing questions, demo requests, product inquiries
- support: existing customer with a problem, bug report, help request, account issue
- partnership: collaboration proposals, affiliate requests, integration inquiries, B2B
- spam: irrelevant, promotional, bot-generated, or malicious content

Respond ONLY with a JSON object in this exact format, no other text:
{
  "category": "sales|support|partnership|spam",
  "confidence": "high|medium|low",
  "reasoning": "one sentence explanation"
}"""

SALES_KEYWORDS = ("buy", "price", "pricing", "quote", "demo", "trial", "purchase", "cost", "sales", "subscription")
SUPPORT_KEYWORDS = ("bug", "issue", "error", "broken", "help", "not working", "problem", "fix", "support", "account")
PARTNERSHIP_KEYWORDS = ("partner", "partnership", "collaborat", "integrat", "affiliate", "b2b", "reseller")
SPAM_KEYWORDS = ("seo services", "rank #1", "click here", "crypto", "investment opportunity", "viagra", "lottery")

CHANNEL_MAP = {
    "sales":       ("SLACK_SALES_WEBHOOK",       "#sales"),
    "support":     ("SLACK_SUPPORT_WEBHOOK",     "#support"),
    "partnership": ("SLACK_PARTNERSHIP_WEBHOOK", "#partnerships"),
    "spam":        ("SLACK_SPAM_WEBHOOK",        "#spam-archive"),
}


def _channel_for(category: str) -> tuple[str, str]:
    return CHANNEL_MAP.get(category, CHANNEL_MAP["sales"])


def _mock_enabled() -> bool:
    return os.getenv("MOCK_CLASSIFIER", "").strip().lower() in ("1", "true", "yes")


def _mock_classify(message: str) -> dict:
    text = message.lower()

    def hits(keywords: tuple[str, ...]) -> int:
        return sum(1 for kw in keywords if kw in text)

    scores = {
        "spam": hits(SPAM_KEYWORDS),
        "partnership": hits(PARTNERSHIP_KEYWORDS),
        "support": hits(SUPPORT_KEYWORDS),
        "sales": hits(SALES_KEYWORDS),
    }
    category, score = max(scores.items(), key=lambda kv: kv[1])

    if score == 0:
        return {
            "category": "sales",
            "confidence": "low",
            "reasoning": "Mock classifier: no keywords matched, defaulted to sales.",
        }

    confidence = "high" if score >= 2 else "medium"
    return {
        "category": category,
        "confidence": confidence,
        "reasoning": f"Mock classifier: matched {score} '{category}' keyword(s).",
    }


def _classify_message(name: str, email: str, message: str) -> dict:
    if _mock_enabled():
        logger.info("MOCK_CLASSIFIER enabled — skipping Anthropic API call.")
        return _mock_classify(message)

    try:
        response = _client().messages.create(
            model=MODEL_ID,
            max_tokens=256,
            system=SYSTEM_PROMPT,
            messages=[{
                "role": "user",
                "content": f"Name: {name}\nEmail: {email}\nMessage: {message}",
            }],
        )
        return json.loads(response.content[0].text.strip())
    except (anthropic.APIError, anthropic.APIConnectionError, json.JSONDecodeError) as exc:
        # Graceful degradation: keep the demo working when API/credits/network fail.
        logger.warning("Anthropic API unavailable (%s) — falling back to mock classifier.", exc)
        return _mock_classify(message)


@router.post("/classify", response_model=InboxResponse)
def classify(payload: InboxRequest) -> InboxResponse:
    try:
        result = _classify_message(payload.name, payload.email, payload.message)
    except Exception as exc:
        logger.exception("Classification failed")
        raise HTTPException(status_code=502, detail=f"Classification failed: {exc}")

    category = result.get("category", "sales")
    confidence = result.get("confidence", "low")
    reasoning = result.get("reasoning", "")

    webhook_env_key, channel = _channel_for(category)
    slack_posted = post_to_slack(
        webhook_env_key=webhook_env_key,
        title=f"New {category.upper()} message → routed to {channel}",
        fields={
            "Name": payload.name,
            "Email": payload.email,
            "Message": payload.message,
        },
        context=f"AI reasoning: {reasoning}",
    )

    return InboxResponse(
        category=category,
        confidence=confidence,
        reasoning=reasoning,
        slack_posted=slack_posted,
        routed_to=channel,
    )
