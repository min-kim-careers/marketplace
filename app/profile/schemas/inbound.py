from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field, conint, model_validator

from app.core.schemas.inbound import InboundBase
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


class ProfileInCreateDB(BaseModel):
    email: EmailStr
    handle: str


class ProfileInUpdateDB(BaseModel):
    email: Optional[EmailStr] = None
    handle: Optional[str] = None
    rating: Optional[float] = None
    rating_count: Optional[int] = None
    postcode: Optional[str] = Field(default=None, min_length=4, max_length=4)
    suburb: Optional[str] = None
    state: Optional[str] = None
    avatar_url: Optional[str] = None
