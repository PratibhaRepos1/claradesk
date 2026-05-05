import json
import logging
import os
from functools import lru_cache

import anthropic

logger = logging.getLogger(__name__)

MODEL_ID = "claude-sonnet-4-20250514"


@lru_cache(maxsize=1)
def _client() -> anthropic.Anthropic:
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise RuntimeError("ANTHROPIC_API_KEY is not set. Check backend/.env.")
    return anthropic.Anthropic(api_key=api_key)


def call_claude(system_prompt: str, user_message: str, max_tokens: int = 512) -> dict:
    """Shared Claude API caller used by every module.

    Claude is instructed to respond with JSON only. The raw text is parsed and
    returned as a dict. On parse or transport errors, returns a dict with an
    "error" key so callers can degrade gracefully.
    """
    try:
        response = _client().messages.create(
            model=MODEL_ID,
            max_tokens=max_tokens,
            system=system_prompt,
            messages=[{"role": "user", "content": user_message}],
        )
        raw_text = response.content[0].text.strip()
        return json.loads(raw_text)
    except json.JSONDecodeError as exc:
        logger.warning("Claude returned non-JSON output: %s", exc)
        return {"error": "Claude response was not valid JSON"}
    except (anthropic.APIError, anthropic.APIConnectionError) as exc:
        logger.warning("Anthropic API unavailable: %s", exc)
        return {"error": str(exc)}
    except Exception as exc:
        logger.exception("Unexpected Claude call failure")
        return {"error": str(exc)}
