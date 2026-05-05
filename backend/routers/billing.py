from fastapi import APIRouter, HTTPException

from models.billing import BillingRequest, BillingResponse

router = APIRouter()


@router.post("/nudge", response_model=BillingResponse)
def nudge(payload: BillingRequest) -> BillingResponse:
    # TODO (Week 4): wire up Claude + Slack via services.claude.call_claude
    # and services.slack.post_to_slack(webhook_env_key="SLACK_BILLING_WEBHOOK", ...)
    raise HTTPException(status_code=501, detail="Clara Billing is not implemented yet.")
