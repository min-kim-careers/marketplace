from datetime import datetime, timezone
from typing import Any, Literal

from app.core.helpers import encode_str
from app.core.schemas.outbound import OutboundBase
from app.db.models.chat_room import ChatRoomDB
from app.item.schemas.outbound import ItemOut

ResponseType = Literal["previous", "messages"]


class ChatResponse(OutboundBase):
    type: ResponseType
    data: Any


class ChatMessageOut(OutboundBase):
    id: str
    room_id: str
    is_me: bool
    content: str
    timestamp: str

    @classmethod
    def from_server(cls, event: dict, chat_id: str, room_id: str) -> "ChatMessageOut":
        return ChatMessageOut(
            id=event["event_id"],
            room_id=room_id,
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
            id=encode_str(room.id),
            item=ItemOut.from_db(room.item),
        )
