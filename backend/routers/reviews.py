from fastapi import APIRouter, HTTPException

from models.reviews import ReviewsRequest, ReviewsResponse

router = APIRouter()


@router.post("/draft", response_model=ReviewsResponse)
def draft(payload: ReviewsRequest) -> ReviewsResponse:
    # TODO (Week 6): wire up Claude + Slack via services.claude.call_claude
    # and services.slack.post_to_slack(webhook_env_key="SLACK_REVIEWS_WEBHOOK", ...)
    raise HTTPException(status_code=501, detail="Clara Reviews is not implemented yet.")
