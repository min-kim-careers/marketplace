from typing import List, Optional


from app.common.schemas.request import RequestBase
from app.item.enums import ItemCategory, ItemCondition


class ItemUpdate(RequestBase):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[ItemCategory] = None
    condition: Optional[ItemCondition] = None
    postcode: Optional[str] = None
    image_urls: Optional[List[str]] = None


class ItemCreate(RequestBase):
    name: str
    description: str
    price: float
    category: ItemCategory
    condition: ItemCondition
    postcode: str
    image_urls: Optional[List[str]] = None
