from typing import List, Optional
from uuid import UUID

from app.common.schemas.request import ApiRequest

DEFAULT_PAGINATION_PAGE = 1
DEFAULT_PAGINATION_LIMIT = 9


class GetItemsRequest(ApiRequest):
    keyword: Optional[str] = None

    page: int = DEFAULT_PAGINATION_PAGE
    limit: int = DEFAULT_PAGINATION_LIMIT

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.limit


class ItemUpdateRequest(ApiRequest):
    id: Optional[int] = None
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    condition: Optional[str] = None
    postcode: Optional[str] = None
    image_urls: Optional[List[str]] = None
    profile_id: Optional[UUID] = None
