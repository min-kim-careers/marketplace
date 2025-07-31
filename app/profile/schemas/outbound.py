from typing import Generic, Optional, TypeVar

from app.core.schemas.outbound import OutboundBase


T = TypeVar("T")


class ProfileResponse(OutboundBase, Generic[T]):
    message: Optional[str] = None
    data: Optional[T] = None


class ProfileExtra(OutboundBase):
    image_limit: int
    listing_limit: int


class ProfileOut(OutboundBase):
    email: str
    handle: str
    rating: float
    rating_count: int
    postcode: Optional[str] = None
    suburb: Optional[str] = None
    state: Optional[str] = None
    avatar_url: Optional[str] = None
