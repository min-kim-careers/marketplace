from typing import Optional
from app.common.schemas.response import ApiResponse


class ProfileOut(ApiResponse):
  email: str
  handle: str
  rating: float
  rating_count: int
  postcode: Optional[str] = None
  avatar_url: Optional[str] = None