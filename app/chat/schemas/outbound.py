from datetime import datetime, timezone
from typing import Any, Literal
from uuid import UUID
from app.core.helpers import encode_alias
from app.core.schemas.outbound import OutboundBase
from app.db.models.chat_room import ChatRoomDB
from app.item.schemas.outbound import ItemOut
from app.profile.schemas.outbound import ProfileOut

ResponseType = Literal["previous", "messages"]


class ChatResponse(OutboundBase):
    type: ResponseType
    data: Any


class MessageOut(OutboundBase):
    id: str
    is_me: bool
    content: str
    timestamp: str

    @classmethod
    def parse_matrix_data(cls, event: dict, chat_id: str) -> "MessageOut":
        return MessageOut(
            id=event["event_id"],
            is_me=event["sender"] == chat_id,
            content=event["content"]["body"],
            timestamp=datetime.fromtimestamp(
                event["origin_server_ts"] / 1000, tz=timezone.utc
            ).isoformat(),
        )


class ChatRoomOut(OutboundBase):
    id: str
    item: ItemOut

    @classmethod
    def from_db(cls, room: ChatRoomDB) -> "ChatRoomOut":
        return ChatRoomOut(
            id=encode_alias(room.id),
            item=ItemOut.from_db(room.item),
        )
