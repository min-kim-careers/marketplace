from typing import Annotated, Literal, Union
from uuid import UUID

from pydantic import Field, TypeAdapter, field_validator

from app.core.helpers import decode_uuid
from app.core.schemas.inbound import InboundBase


class ChatJoinIn(InboundBase):
    type: Literal["join"]
    room_id: UUID = Field(..., alias="roomAlias")

    @field_validator("room_id", mode="before")
    def decode_alias(cls, v):
        return decode_uuid(v)


class ChatTextIn(InboundBase):
    type: Literal["text"]
    content: str


ChatPayloadInType = Annotated[
    Union[ChatTextIn, ChatJoinIn],
    Field(discriminator="type"),
]

ChatPayloadIn = TypeAdapter(ChatPayloadInType)
