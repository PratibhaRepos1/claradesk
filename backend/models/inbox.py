from typing import Literal

from pydantic import BaseModel, EmailStr, Field


class InboxRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    message: str = Field(..., min_length=1, max_length=5000)


class InboxResponse(BaseModel):
    category: Literal["sales", "support", "partnership", "spam"]
    confidence: Literal["high", "medium", "low"]
    reasoning: str
    slack_posted: bool
    routed_to: str
