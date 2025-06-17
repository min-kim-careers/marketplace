from datetime import datetime
from typing import List, Optional

from app.common.schemas.response import ResponseBase
from app.item.enums import (ItemCategory, ItemCondition, ItemSortBy,
                            ItemSortOrder, ItemStatus)
from app.item.model import ItemDB


class ItemOut(ResponseBase):
    id: int
    name: str
    description: str
    price: float
    brand: Optional[str] = None
    category: ItemCategory
    condition: ItemCondition
    status: ItemStatus
    postcode: str
    created_at: datetime
    updated_at: datetime
    expires_at: Optional[datetime] = None
    image_urls: List[str]

    profile_handle: str

    @classmethod
    def from_db(cls, item: ItemDB) -> "ItemOut":
        return cls.model_validate(
            {
                **item.__dict__,
                "profile_handle": item.profile.handle,
            }
        )
    
class ItemListing(ResponseBase):
    id: int
    name: str
    description: str
    price: float
    brand: Optional[str] = None
    category: ItemCategory
    condition: ItemCondition
    status: ItemStatus
    postcode: str
    created_at: datetime
    updated_at: datetime
    expires_at: Optional[datetime] = None
    image_urls: List[str]


class ItemSortOption(ResponseBase):
    sort_by: ItemSortBy
    sort_order: ItemSortOrder
    label: str
    is_default: bool = False