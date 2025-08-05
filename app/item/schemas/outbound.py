from datetime import datetime
from typing import List, Optional

from app.core.schemas.outbound import OutboundBase
from app.core.utils import encode_slug
from app.db.models.item import ItemDB
from app.item.enums import ItemCategory, ItemCondition, ItemStatus
from app.item.helpers import format_item_date


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
    created_at_label: str
    updated_at: datetime
    updated_at_label: str
    expires_at: Optional[datetime] = None
    image_urls: List[str]

    profile_handle: str

    @classmethod
    def from_db(cls, item: ItemDB) -> "ItemOut":
        return cls.model_validate(
            {
                **item.__dict__,
                "profile_handle": item.user.profile.handle,
                "id": encode_slug(item.id),
                "updated_at_label": format_item_date(item.updated_at),
                "created_at_label": format_item_date(item.created_at),
            },
            from_attributes=True,
        )
