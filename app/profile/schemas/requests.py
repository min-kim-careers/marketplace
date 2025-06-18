from typing import Optional

from pydantic import EmailStr, Field

from app.common.schemas.request import RequestBase


class ProfileInRequest(RequestBase):
    email: Optional[EmailStr] = None
    handle: Optional[str] = None
    rating: Optional[float] = None
    rating_count: Optional[int] = None
    postcode: Optional[str] = Field(default=None, min_length=4, max_length=4)
    avatar_url: Optional[str] = None

    
