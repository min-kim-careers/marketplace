from typing import Generic, Optional, TypeVar

from app.common.schemas.response import ResponseBase


T = TypeVar("T")


class ItemResponse(ResponseBase, Generic[T]):
    success: bool = False
    data: Optional[T] = None
