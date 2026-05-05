import logging
import os
from typing import Optional

import requests

logger = logging.getLogger(__name__)


def post_to_slack(
    webhook_env_key: str,
    title: str,
    fields: dict,
    context: Optional[str] = "",
    extra_text: Optional[str] = None,
) -> bool:
    """Shared Slack poster used by every module.

    webhook_env_key: name of the .env variable holding the webhook URL
    title:          headline shown at the top of the Slack message
    fields:         dict of label -> value rendered as a fields block
    context:        small footer text (e.g. AI reasoning)
    extra_text:     optional long-form text block (e.g. drafted email body)

    Returns True if Slack accepted the post, False if the webhook is missing
    or the HTTP call fails.
    """
    webhook_url = os.getenv(webhook_env_key)
    if not webhook_url:
        logger.warning("Missing webhook env var %s; skipping Slack post", webhook_env_key)
        return False

    field_blocks = [
        {"type": "mrkdwn", "text": f"*{label}:*\n{value}"}
        for label, value in fields.items()
    ]

    blocks = [
        {"type": "section", "text": {"type": "mrkdwn", "text": f"*{title}*"}},
    ]

    if field_blocks:
        blocks.append({"type": "section", "fields": field_blocks})

    if extra_text:
        blocks.append({
            "type": "section",
            "text": {"type": "mrkdwn", "text": extra_text},
        })

    if context:
        blocks.append({
            "type": "context",
            "elements": [{"type": "mrkdwn", "text": context}],
        })

    payload = {"text": title, "blocks": blocks}

    try:
        response = requests.post(webhook_url, json=payload, timeout=10)
        return response.status_code == 200
    except requests.RequestException as exc:
        logger.error("Slack post failed for %s: %s", webhook_env_key, exc)
        return False
