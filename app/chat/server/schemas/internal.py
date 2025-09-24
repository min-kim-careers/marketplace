from pydantic import BaseModel, Field, TypeAdapter


from typing import Annotated, Literal, Optional, Union


class ChatInternalText(BaseModel):
    type: Literal["text"] = "text"
    user_id: str
    room_id: str
    content: str
    timestamp: Optional[str] = None


class ChatInternalRead(BaseModel):
    type: Literal["read"] = "read"
    user_id: str
    room_id: str


class ChatInternalRoom(BaseModel):
    type: Literal["room"] = "room"
    user_id: str
    room_id: str


class ChatInternalTyping(BaseModel):
    type: Literal["typing"] = "typing"
    user_id: str
    room_id: str
    typing: bool


ChatInternalType = Annotated[
    Union[
        ChatInternalText,
        ChatInternalRead,
        ChatInternalTyping,
        ChatInternalRoom,
    ],
    Field(discriminator="type"),
]

ChatInternalAdapter = TypeAdapter(ChatInternalType)
