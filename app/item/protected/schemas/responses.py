from typing import List
from app.common.schemas.response import ResponseBase
from app.item.schemas.common import ItemOut, ItemSortOption


class UpdateItemResponse(ResponseBase):
    item: ItemOut


class CreateItemResponse(ResponseBase):
    item: ItemOut

