from typing import List

from app.common.schemas.response import ResponseBase
from app.item.schemas.common import ItemOut, ItemSortOption


class GetItemsResponse(ResponseBase):
    items: List[ItemOut]
    count: int

