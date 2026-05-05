from typing import Literal

from pydantic import BaseModel, EmailStr, Field


class BillingRequest(BaseModel):
    invoice_number: str = Field(..., min_length=1, max_length=100)
    amount: float = Field(..., gt=0)
    days_overdue: int = Field(..., ge=0)
    customer_name: str = Field(..., min_length=1, max_length=100)
    customer_email: EmailStr


class BillingResponse(BaseModel):
    subject: str
    email_body: str
    tone: Literal["friendly", "direct", "firm"]
    slack_posted: bool
