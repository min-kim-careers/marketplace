from typing import List, Optional
from uuid import UUID

from pydantic import field_validator


from app.common.schemas.request import RequestBase
from app.item.enums import ItemSortBy, ItemSortOrder

DEFAULT_PAGINATION_PAGE = 1
DEFAULT_PAGINATION_LIMIT = 9


DEFAULT_SORT_ORDER = ItemSortOrder.asc
DEFAULT_SORT_BY = ItemSortBy.created_at

class GetItemsRequest(RequestBase):
    keyword: Optional[str] = None

    sort_order: Optional[ItemSortOrder] = DEFAULT_SORT_ORDER
    sort_by: Optional[ItemSortBy] = DEFAULT_SORT_BY

    page: int = DEFAULT_PAGINATION_PAGE
    limit: int = DEFAULT_PAGINATION_LIMIT

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.limit
    
    @field_validator("keyword")
    @classmethod
    def normalise_keyword(cls, v: str):
        return v.lower() if v else v