from typing import List, Optional
from uuid import UUID

from fastapi import Query
from pydantic import EmailStr

from app.common.schemas.request import ApiRequest

DEFAULT_PAGINATION_PAGE = 1
DEFAULT_PAGINATION_LIMIT = 9


class ItemUpsertRequest(ApiRequest):
    id: Optional[int] = None
    name: str
    description: str
    price: float
    category: str
    condition: str
    postcode: str
    image_urls: List[str] = []
    profile_id: UUID


class GetItemsRequest(ApiRequest):
    keyword: Optional[str] = None

    page: int = DEFAULT_PAGINATION_PAGE
    limit: int = DEFAULT_PAGINATION_LIMIT

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.limit
