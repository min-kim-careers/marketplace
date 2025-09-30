from datetime import datetime
from typing import List, Optional

from app.core.helpers import encode_uuid
from app.core.schemas.outbound import OutboundBase
from app.db.models.item import ItemDB
from app.item.enums import ItemCategory, ItemCondition, ItemStatus
from app.profile.schemas.outbound import ProfileOut


class ItemOut(OutboundBase):
    alias: str
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

    profile: ProfileOut

    @classmethod
    def from_db(cls, item: ItemDB) -> "ItemOut":
        return ItemOut(
            **item.__dict__,
            profile=ProfileOut.model_validate(item.user.profile, from_attributes=True),
            alias=encode_uuid(item.id),
            image_urls=[
                img.filename
                for img in list(sorted(item.images, key=lambda img: img.index))
            ],
        )
