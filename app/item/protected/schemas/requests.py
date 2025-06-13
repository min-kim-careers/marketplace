from typing import List, Optional

from pydantic import field_validator


from app.common.schemas.request import RequestBase
from app.item.enums import ItemCategory, ItemCondition
from app.profile.schemas.common import DEFAULT_IMAGE_LIMIT


class ItemUpdateRequest(RequestBase):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[ItemCategory] = None
    condition: Optional[ItemCondition] = None
    postcode: Optional[str] = None
    image_urls: Optional[List[str]] = None

    @field_validator('image_urls')
    def validate_image_urls(cls, v):
        if cls.image_urls and len(cls.image_urls) > DEFAULT_IMAGE_LIMIT:
            raise ValueError(f"Maximum of {DEFAULT_IMAGE_LIMIT} images allowed.")
        return v



class ItemCreateRequest(RequestBase):
    name: str
    description: str
    price: float
    category: ItemCategory
    condition: ItemCondition
    postcode: str
    image_urls: Optional[List[str]] = None

    @field_validator('image_urls')
    def validate_image_urls(cls, v):
        if cls.image_urls and len(cls.image_urls) > DEFAULT_IMAGE_LIMIT:
            raise ValueError(f"Maximum of {DEFAULT_IMAGE_LIMIT} images allowed.")
        return v