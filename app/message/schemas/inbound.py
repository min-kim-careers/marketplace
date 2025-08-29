from typing import Optional

from app.core.schemas.inbound import InboundBase
from app.message.constants.defaults import (
    DEFAULT_PAGINATION_LIMIT,
    DEFAULT_PAGINATION_PAGE,
    DEFAULT_SORT_BY,
    DEFAULT_SORT_ORDER,
)
from app.message.enums import MessageSortBy, MessageSortOrder
from pydantic import BaseModel


class MessageQuery(InboundBase):
    page: int = DEFAULT_PAGINATION_PAGE
    limit: int = DEFAULT_PAGINATION_LIMIT
    sort_order: Optional[MessageSortOrder] = DEFAULT_SORT_ORDER
    sort_by: Optional[MessageSortBy] = DEFAULT_SORT_BY

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.limit


class MessageIn(InboundBase):
    thread_id: str
    content: str


class MessageInCreateDB(BaseModel):
    content: str


class MessageInUpdateDB(BaseModel):
    content: Optional[str] = None
