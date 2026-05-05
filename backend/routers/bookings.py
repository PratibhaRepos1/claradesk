from fastapi import APIRouter, HTTPException

from models.bookings import BookingsRequest, BookingsResponse

router = APIRouter()


@router.post("/winback", response_model=BookingsResponse)
def winback(payload: BookingsRequest) -> BookingsResponse:
    # TODO (Week 5): wire up Claude + Slack via services.claude.call_claude
    # and services.slack.post_to_slack(webhook_env_key="SLACK_BOOKINGS_WEBHOOK", ...)
    raise HTTPException(status_code=501, detail="Clara Bookings is not implemented yet.")
