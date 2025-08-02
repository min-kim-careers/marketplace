from typing import List, Optional
from uuid import UUID

from fastapi import File, UploadFile
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
from app.item.constants.defaults import *


class ItemsQuery(InboundBase):
    keyword: Optional[str] = None
    sort_order: Optional[ItemSortOrder] = DEFAULT_SORT_ORDER
    sort_by: Optional[ItemSortBy] = DEFAULT_SORT_BY
    page: int = DEFAULT_PAGINATION_PAGE
    limit: int = DEFAULT_PAGINATION_LIMIT
    user_option: Optional[ItemUserOption] = None
    active_only: Optional[bool] = True

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
    image_urls: Optional[List[str]] = None
    upload_images: Optional[List[UploadFile]] = File(default=None)

    @model_validator(mode="after")
    def check_image_urls_if_upload_images(self):
        if self.image_urls is None and self.upload_images is not None:
            raise ValueError("image_urls must be None if upload_images is None")
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
    image_urls: Optional[List[str]] = None
