from typing import Any, Literal
from app.core.schemas.outbound import OutboundBase
from app.core.utils import encode_slug

ResponseType = Literal["history", "message"]

class ChatResponse(OutboundBase):
    type: ResponseType
    data: Any


class MessageOut(OutboundBase):
    id: str
    room_id: str
    sender: str
    content: str
    timestamp: int

    @classmethod
    def from_synapse(cls, event: dict) -> "MessageOut":
        return MessageOut(
            id=event["event_id"],
            room_id=event["room_id"],
            sender=event["sender"],
            content=event["content"]["body"],
            timestamp=event["origin_server_ts"],
        )
