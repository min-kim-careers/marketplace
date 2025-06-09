from datetime import datetime
from typing import List, Optional

from app.common.schemas.response import ApiResponse
from app.item.model import ItemDB


class ItemOut(ApiResponse):
    name: str
    description: str
    price: float
    category: str
    created_at: datetime
    updated_at: datetime
    expires_at: Optional[datetime] = None
    postcode: str
    condition: str
    image_urls: List[str]

    profile_handle: Optional[str] = None

    @classmethod
    def from_db(cls, item: ItemDB) -> "ItemOut":
        return cls.model_validate(
            {
                **item.__dict__,
                "profile_handle": item.profile.handle,
            }
        )
