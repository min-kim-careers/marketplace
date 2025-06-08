from typing import Generic, Optional, TypeVar

from app.common.schemas.response import ApiResponse


T = TypeVar("T")


class ProfileResponse(ApiResponse, Generic[T]):
    success: bool = False
    message: Optional[str] = None
    data: Optional[T] = None
