from fastapi import APIRouter, HTTPException

from models.welcome import WelcomeRequest, WelcomeResponse

router = APIRouter()


@router.post("/draft", response_model=WelcomeResponse)
def draft(payload: WelcomeRequest) -> WelcomeResponse:
    # TODO (Week 3): wire up Claude + Slack via services.claude.call_claude
    # and services.slack.post_to_slack(webhook_env_key="SLACK_ONBOARDING_WEBHOOK", ...)
    raise HTTPException(status_code=501, detail="Clara Welcome is not implemented yet.")
