from typing import Generic, List, Optional, TypeVar

from app.common.schemas.response import ApiResponse
from app.item.schemas.common import ItemOut


T = TypeVar("T")


class ItemResponse(ApiResponse, Generic[T]):
    success: bool = False
    data: Optional[T] = None


class GetItemsResponse(ApiResponse):
    items: List[ItemOut]
    count: int
