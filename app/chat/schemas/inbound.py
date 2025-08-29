from uuid import UUID

from pydantic import BaseModel

from app.core.schemas.inbound import InboundBase


class ChatRoomInDB(BaseModel):
    item_id: UUID
    buyer_id: UUID


class RoomQuery(InboundBase):
    pass
