from typing import List, Literal, Optional

from pydantic import BaseModel, Field


class ReviewsRequest(BaseModel):
    reviewer_name: str = Field(..., min_length=1, max_length=100)
    rating: int = Field(..., ge=1, le=5)
    review_text: str = Field(..., min_length=1, max_length=5000)
    platform: Literal["google", "yelp", "tripadvisor"]


class RootIssue(BaseModel):
    issue: str
    suggested_owner: Literal[
        "frontdesk", "kitchen", "support", "billing", "mgmt", "ops", "other"
    ]


class ReviewsResponse(BaseModel):
    public_response: str
    public_word_count: int
    internal_note: str
    root_issues: List[RootIssue]
    severity: Literal["mild", "moderate", "severe"]
    severity_reasoning: str
    suggested_compensation: Optional[str] = ""
    slack_posted: bool
