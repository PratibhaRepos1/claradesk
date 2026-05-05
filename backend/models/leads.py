from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field


class LeadsRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    inquiry_details: str = Field(..., min_length=1, max_length=5000)
    company: Optional[str] = Field(default=None, max_length=200)


class LeadsResponse(BaseModel):
    subject: str
    email_body: str
    tone: Literal["friendly", "professional", "urgent"]
    slack_posted: bool
