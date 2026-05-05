from fastapi import APIRouter, HTTPException

from models.leads import LeadsRequest, LeadsResponse

router = APIRouter()


@router.post("/draft", response_model=LeadsResponse)
def draft(payload: LeadsRequest) -> LeadsResponse:
    # TODO (Week 2): wire up Claude + Slack via services.claude.call_claude
    # and services.slack.post_to_slack(webhook_env_key="SLACK_LEADS_WEBHOOK", ...)
    raise HTTPException(status_code=501, detail="Clara Leads is not implemented yet.")
