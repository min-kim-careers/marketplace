from typing import Annotated, Literal, Optional, Union

from pydantic import Field, TypeAdapter


from app.chat.schemas.outbound import ChatRoomOut
from app.chat.server.schemas.internal import ChatInternalText
from app.core.schemas.outbound import OutboundBase
from app.db.models.chat_message import ChatMessageDB


class ChatTypingOut(OutboundBase):
    type: Literal["typing"] = "typing"
    typing: bool


class ChatTextOut(OutboundBase):
    type: Literal["text"] = "text"
    content: str
    mine: bool
    timestamp: str
    read: Optional[bool] = False

    # restored messages
    @classmethod
    def from_db(cls, msg: ChatMessageDB, mine: bool) -> "ChatTextOut":
        ts = msg.timestamp
        return ChatTextOut(
            content=msg.content,
            mine=mine,
            timestamp=ts.isoformat(),
        )

    # real time message
    @classmethod
    def from_internal(cls, msg: ChatInternalText, mine: bool) -> "ChatTextOut":
        if not msg.timestamp:
            raise ValueError("timestamp missing from stream")

        return ChatTextOut(
            content=msg.content,
            mine=mine,
            timestamp=msg.timestamp,
        )


class ChatClientOut(OutboundBase):
    type: Literal["client"] = "client"
    room: ChatRoomOut


class ChatConnectedOut(OutboundBase):
    type: Literal["connected"] = "connected"


class ChatErrorOut(OutboundBase):
    type: Literal["error"] = "error"
    message: Optional[str] = None


class ChatJoinedOut(OutboundBase):
    type: Literal["joined"] = "joined"


class ChatRestoredOut(OutboundBase):
    type: Literal["restored"] = "restored"
    previous: list[ChatTextOut] = []


class ChatReadOut(OutboundBase):
    type: Literal["read"] = "read"
    last_read: str


ChatPayloadOutType = Annotated[
    Union[
        ChatTextOut,
        ChatJoinedOut,
        ChatRestoredOut,
        ChatConnectedOut,
        ChatErrorOut,
        ChatReadOut,
        ChatTypingOut,
        ChatClientOut,
    ],
    Field(discriminator="type"),
]

ChatPayloadOut = TypeAdapter(ChatPayloadOutType)
