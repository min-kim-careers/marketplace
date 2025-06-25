from typing import List, Optional
from pydantic import BaseModel, Field

from app.item.enums import ItemCategory, ItemCondition, ItemStatus


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
