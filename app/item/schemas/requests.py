from typing import List, Optional
from uuid import UUID

from pydantic import Field, field_validator, model_validator

from app.common.schemas.request import RequestBase
from app.item.enums import (
    ItemCategory,
    ItemCondition,
    ItemSortBy,
    ItemSortOrder,
)

DEFAULT_PAGINATION_PAGE = 1
DEFAULT_PAGINATION_LIMIT = 9

DEFAULT_SORT_ORDER = ItemSortOrder.asc
DEFAULT_SORT_BY = ItemSortBy.created_at


class ItemsRequest(RequestBase):
    keyword: Optional[str] = None

    sort_order: Optional[ItemSortOrder] = DEFAULT_SORT_ORDER
    sort_by: Optional[ItemSortBy] = DEFAULT_SORT_BY

    page: int = DEFAULT_PAGINATION_PAGE
    limit: int = DEFAULT_PAGINATION_LIMIT

    exclude_user: Optional[UUID] = None

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.limit

    @field_validator("keyword")
    @classmethod
    def normalise_keyword(cls, v: str):
        return v.lower() if v else v


class ItemUpdateRequest(RequestBase):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[ItemCategory] = None
    condition: Optional[ItemCondition] = None
    postcode: Optional[str] = Field(default=None, min_length=4, max_length=4)


class ItemCreateRequest(RequestBase):
    name: str
    description: str
    price: float
    category: ItemCategory
    condition: ItemCondition
    postcode: str = Field(..., min_length=4, max_length=4)
