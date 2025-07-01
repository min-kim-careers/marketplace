from typing import Generic, Optional, TypeVar
from uuid import UUID

from app.common.schemas.outbound import OutboundBase

DEFAULT_IMAGE_LIMIT = 3

T = TypeVar("T")


class ProfileResponse(OutboundBase, Generic[T]):
    message: Optional[str] = None
    data: Optional[T] = None


class ProfileExtra(OutboundBase):
    image_limit: Optional[int] = DEFAULT_IMAGE_LIMIT


class ProfileOut(OutboundBase):
    email: str
    handle: str
    rating: float
    rating_count: int
    postcode: Optional[str] = None
    suburb: Optional[str] = None
    state: Optional[str] = None
    avatar_url: Optional[str] = None
