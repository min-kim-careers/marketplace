from uuid import UUID

from app.core.schemas.inbound import InboundBase
from pydantic import BaseModel


class ChatRoomInDB(BaseModel):
    id: str
    item_id: UUID
    user_1_id: UUID
    user_1_filter_id: str
    user_2_id: UUID
    user_2_filter_id: str


class ChatMessageIn(InboundBase):
    id: str
    room_id: str
    is_me: bool
    content: str
    timestamp: str
