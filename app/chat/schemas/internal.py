from pydantic import BaseModel


from uuid import UUID


class ChatRoomInDB(BaseModel):
    item_id: UUID
    buyer_id: UUID
    seller_id: UUID