from typing import Generic, List, Optional, TypeVar

from app.common.schemas.response import ApiResponse
from app.models.item import Item


T = TypeVar("T")


class ItemResponse(ApiResponse, Generic[T]):
    success: bool = False
    message: Optional[str] = None
    data: Optional[T] = None

class GetItemsResponse(ApiResponse):
    items: List[Item]
    count: int