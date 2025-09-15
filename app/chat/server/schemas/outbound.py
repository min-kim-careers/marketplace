from typing import Annotated, Literal, Optional, Union
from uuid import UUID

from pydantic import Field, TypeAdapter


from app.chat.server.stream import StreamMessage
from app.core.schemas.outbound import OutboundBase
from app.db.models.chat_message import ChatMessageDB


class ChatTextOut(OutboundBase):
    type: Literal["text"] = "text"
    content: str
    is_me: bool
    timestamp: str

    @classmethod
    def from_db(cls, msg: ChatMessageDB, user_id: UUID) -> "ChatTextOut":
        return cls.model_validate(
            {
                "content": msg.content,
                "is_me": user_id == msg.user_id,
                "timestamp": msg.timestamp.isoformat(),
            },
            from_attributes=True,
        )

    @classmethod
    def from_stream(cls, msg: StreamMessage, user_id: str) -> "ChatTextOut":
        return cls.model_validate(
            {
                "content": msg.content,
                "is_me": user_id == msg.user_id,
                "timestamp": msg.timestamp,
            },
            from_attributes=True,
        )


class ChatConnectedOut(OutboundBase):
    type: Literal["connected"] = "connected"


class ChatErrorOut(OutboundBase):
    type: Literal["error"] = "error"
    message: Optional[str] = None


class ChatJoinedOut(OutboundBase):
    type: Literal["joined"] = "joined"


class ChatRestoreOut(OutboundBase):
    type: Literal["restore"] = "restore"
    previous: list[ChatTextOut] = []


ChatPayloadOutType = Annotated[
    Union[
        ChatTextOut,
        ChatJoinedOut,
        ChatRestoreOut,
        ChatConnectedOut,
        ChatErrorOut,
    ],
    Field(discriminator="type"),
]

ChatPayloadOut = TypeAdapter(ChatPayloadOutType)
