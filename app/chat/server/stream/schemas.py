from pydantic import BaseModel, Field, TypeAdapter


from typing import Annotated, Literal, Optional, Union


class ChatStreamText(BaseModel):
    type: Literal["text"] = "text"
    user_id: str
    room_id: str
    content: str
    timestamp: Optional[str] = None


class ChatStreamRead(BaseModel):
    type: Literal["read"] = "read"
    user_id: str
    room_id: str


ChatStreamType = Annotated[
    Union[
        ChatStreamText,
        ChatStreamRead,
    ],
    Field(discriminator="type"),
]

ChatStreamAdapter = TypeAdapter(ChatStreamType)
