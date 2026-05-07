from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field


class WelcomeRequest(BaseModel):
    customer_name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    product_plan: str = Field(..., min_length=1, max_length=120)
    company: Optional[str] = Field(default=None, max_length=200)


class ChecklistItem(BaseModel):
    step: str
    why: str


class WelcomeResponse(BaseModel):
    subject: str
    email_body: str
    word_count: int
    checklist: list[ChecklistItem]
    first_win: str
    health_signal: Literal["green", "yellow", "red"]
    health_reasoning: str
    day_7_followup_subject: str
    slack_posted: bool
