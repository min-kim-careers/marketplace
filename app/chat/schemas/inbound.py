from typing import Optional
from uuid import UUID

from pydantic import BaseModel

from app.chat.constants import (
    DEFAULT_PAGINATION_LIMIT,
    DEFAULT_PAGINATION_PAGE,
    DEFAULT_SORT_BY,
    DEFAULT_SORT_ORDER,
)
from app.chat.enums import RoomSortBy, RoomSortOrder
from app.core.schemas.inbound import InboundBase


class ChatRoomInDB(BaseModel):
    item_id: UUID
    buyer_id: UUID
    seller_id: UUID


class ChatRoomQuery(InboundBase):
    page: int = DEFAULT_PAGINATION_PAGE
    limit: int = DEFAULT_PAGINATION_LIMIT

    sort_order: Optional[RoomSortOrder] = DEFAULT_SORT_ORDER
    sort_by: Optional[RoomSortBy] = DEFAULT_SORT_BY

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.limit
