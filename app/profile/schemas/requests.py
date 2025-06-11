from pydantic import EmailStr
from uuid import UUID
from typing import Optional

from app.common.schemas.request import RequestBase


class ProfileIn(RequestBase):
    email: Optional[EmailStr] = None
    handle: Optional[str] = None
    rating: Optional[float] = None
    rating_count: Optional[int] = None
    postcode: Optional[str] = None
    avatar_url: Optional[str] = None

    
