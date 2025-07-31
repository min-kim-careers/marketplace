from typing import Optional

from pydantic import EmailStr, Field, conint

from app.core.schemas.inbound import InboundBase
from uuid import UUID
from typing import Optional


class ProfileIn(InboundBase):
    email: Optional[EmailStr] = None
    handle: Optional[str] = None
    rating: Optional[float] = None
    rating_count: Optional[int] = None
    postcode: Optional[str] = Field(default=None, min_length=4, max_length=4)
    suburb: Optional[str] = None
    state: Optional[str] = None
    avatar_url: Optional[str] = None


class RatingIn(InboundBase):
    rater_id: Optional[UUID] = None
    item_id: Optional[UUID] = None
    rating: Optional[int] = Field(default=None, ge=1, le=5)
    comment: Optional[str] = None
