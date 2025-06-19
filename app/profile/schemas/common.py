from typing import Optional

from app.common.schemas.response import ResponseBase

DEFAULT_IMAGE_LIMIT = 3

class ProfileExtra(ResponseBase):
  image_limit: Optional[int] = DEFAULT_IMAGE_LIMIT

class ProfileOut(ResponseBase):
  email: str
  handle: str
  rating: float
  rating_count: int
  postcode: Optional[str] = None
  suburb: Optional[str] = None
  state: Optional[str] = None
  avatar_url: Optional[str] = None