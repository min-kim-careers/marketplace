from pydantic import EmailStr
from uuid import UUID
from typing import Optional

from app.common.schemas.request import ApiRequest


class ProfileCreateRequest(ApiRequest):
    email: EmailStr
    handle: str
    rating: Optional[float] = None
    rating_count: Optional[int] = None
    postcode: Optional[str] = None
    avatar_url: Optional[str] = None
    user_id: UUID


class UpsertProfileRequest(ApiRequest):
    email: Optional[EmailStr] = None
    handle: Optional[str] = None
    rating: Optional[float] = None
    rating_count: Optional[int] = None
    postcode: Optional[str] = None
    avatar_url: Optional[str] = None
    user_id: Optional[UUID] = None
