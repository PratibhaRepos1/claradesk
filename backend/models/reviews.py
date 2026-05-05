from typing import List, Literal

from pydantic import BaseModel, Field


class ReviewsRequest(BaseModel):
    reviewer_name: str = Field(..., min_length=1, max_length=100)
    rating: int = Field(..., ge=1, le=5)
    review_text: str = Field(..., min_length=1, max_length=5000)
    platform: Literal["google", "yelp", "tripadvisor"]


class ReviewsResponse(BaseModel):
    public_response: str
    internal_note: str
    root_issues: List[str]
    slack_posted: bool
