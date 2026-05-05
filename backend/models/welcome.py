from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field


class WelcomeRequest(BaseModel):
    customer_name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    product_plan: str = Field(..., min_length=1, max_length=200)
    company: Optional[str] = Field(default=None, max_length=200)


class WelcomeResponse(BaseModel):
    subject: str
    email_body: str
    checklist: List[str]
    slack_posted: bool
