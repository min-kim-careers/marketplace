from typing import Optional
from app.common.schemas.response import ResponseBase


class ProfileOut(ResponseBase):
  email: str
  handle: str
  rating: float
  rating_count: int
  postcode: Optional[str] = None
  avatar_url: Optional[str] = None