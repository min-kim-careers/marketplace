from pydantic import BaseModel, Field, TypeAdapter


from typing import Annotated, Literal, Optional, Union


class ChatInternalBase(BaseModel):
    user_id: str
    room_id: str


class ChatInternalText(ChatInternalBase):
    type: Literal["text"] = "text"
    content: str
    timestamp: Optional[str] = None


class ChatInternalRead(ChatInternalBase):
    type: Literal["read"] = "read"


class ChatInternalTyping(ChatInternalBase):
    type: Literal["typing"] = "typing"
    typing: bool


class ChatInternalClient(ChatInternalBase):
    type: Literal["client"] = "client"


ChatInternalType = Annotated[
    Union[
        ChatInternalText,
        ChatInternalRead,
        ChatInternalTyping,
        ChatInternalClient,
    ],
    Field(discriminator="type"),
]

ChatInternalAdapter = TypeAdapter(ChatInternalType)
