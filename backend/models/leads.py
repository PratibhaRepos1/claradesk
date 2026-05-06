from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field


class LeadsRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    inquiry_details: str = Field(..., min_length=1, max_length=5000)
    company: Optional[str] = Field(default=None, max_length=200)


class EmailVariant(BaseModel):
    tone: Literal["friendly", "professional"]
    subject: str
    email_body: str
    word_count: int


class LeadsResponse(BaseModel):
    lead_score: Literal["hot", "warm", "cold"]
    score_reasoning: str
    intent_tags: list[str]
    next_action: str
    variants: list[EmailVariant]
    slack_posted: bool
