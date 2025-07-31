from typing import Generic, Optional, TypeVar

from pydantic import BaseModel

from app.core.schemas.outbound import OutboundBase

T = TypeVar("T")


class FirebaseResponse(OutboundBase, Generic[T]):
    message: Optional[str] = None
    data: Optional[T] = None


class FirebaseUser(OutboundBase):
    uid: str
    email: str
    picture: Optional[str] = None