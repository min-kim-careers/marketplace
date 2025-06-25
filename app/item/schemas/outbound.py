from datetime import datetime
from typing import Generic, List, Optional, TypeVar

from app.common.schemas.outbound import OutboundBase
from app.common.utils import uuid_to_slug
from app.db.models.item import ItemDB
from app.item.enums import ItemCategory, ItemCondition, ItemStatus


T = TypeVar("T")


class ItemResponse(OutboundBase, Generic[T]):
    message: Optional[str] = None
    data: Optional[T] = None


class ItemOut(OutboundBase):
    id: str
    name: str
    description: str
    price: float
    brand: Optional[str] = None
    category: ItemCategory
    condition: ItemCondition
    status: ItemStatus
    postcode: str
    suburb: str
    state: str
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
                "id": uuid_to_slug(item.id),
            },
            from_attributes=True,
        )
