from pydantic import EmailStr
from uuid import UUID
from typing import Optional

from app.common.schemas.request import ApiRequest


class ProfileUpsertRequest(ApiRequest):
    email: EmailStr
    handle: str
    rating: Optional[float] = None
    rating_count: Optional[int] = None
    postcode: Optional[str] = None
    avatar_url: Optional[str] = None
    user_id: UUID
