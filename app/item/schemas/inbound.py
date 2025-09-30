from typing import List, Optional

from fastapi import File, Query, UploadFile
from pydantic import BaseModel, Field, field_validator, model_validator

from app.core.schemas.inbound import InboundBase
from app.item.enums import (
    ItemCategory,
    ItemCondition,
    ItemSortBy,
    ItemSortOrder,
    ItemStatus,
    ItemUserOption,
)
from app.item.constants import *


class ItemsQuery(InboundBase):
    page: int = DEFAULT_PAGINATION_PAGE
    limit: int = DEFAULT_PAGINATION_LIMIT

    keyword: Optional[str] = None
    sort_order: Optional[ItemSortOrder] = DEFAULT_SORT_ORDER
    sort_by: Optional[ItemSortBy] = DEFAULT_SORT_BY
    categories: Optional[List[ItemCategory]] = Query(default=None)
    conditions: Optional[List[ItemCondition]] = Query(default=None)
    user_option: Optional[ItemUserOption] = None
    active_only: Optional[bool] = None

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.limit

    @field_validator("keyword")
    @classmethod
    def normalise_keyword(cls, v: str):
        return v.lower() if v else v


class ItemInForm(InboundBase):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[ItemCategory] = None
    condition: Optional[ItemCondition] = None
    status: Optional[ItemStatus] = None
    postcode: Optional[str] = Field(default=None, min_length=4, max_length=4)
    suburb: Optional[str] = None
    state: Optional[str] = None
    upload_indices: Optional[list[int]] = None
    upload_images: Optional[list[UploadFile]] = File(...)

    @model_validator(mode="after")
    def validate_uploads(self):
        if (self.upload_indices, self.upload_images).count(None) == 1:
            raise ValueError("missing upload prerequisites")
        return self


class ItemInDB(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[ItemCategory] = None
    condition: Optional[ItemCondition] = None
    status: Optional[ItemStatus] = None
    postcode: Optional[str] = Field(default=None, min_length=4, max_length=4)
    suburb: Optional[str] = None
    state: Optional[str] = None
