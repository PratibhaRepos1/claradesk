from typing import List, Literal, Optional

from pydantic import BaseModel, Field


class BookingsRequest(BaseModel):
    customer_name: str = Field(..., min_length=1, max_length=100)
    service_type: str = Field(..., min_length=1, max_length=200)
    cancellation_reason: str = Field(..., min_length=1, max_length=2000)
    original_date: str = Field(..., min_length=1, max_length=100)
    booking_history: Optional[str] = Field(default="", max_length=2000)


class BookingsResponse(BaseModel):
    message_body: str
    word_count: int
    suggested_times: List[str]
    sms_variant: str
    tone: Literal["warm", "professional"]
    winback_probability: Literal["high", "medium", "low"]
    winback_reasoning: str
    cancellation_category: Literal[
        "schedule_conflict", "dissatisfaction", "financial", "external", "other"
    ]
    risk_factors: List[str]
    slack_posted: bool
