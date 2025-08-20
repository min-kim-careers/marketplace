from uuid import UUID
from pydantic import BaseModel, model_validator


class ChatRoomInDB(BaseModel):
    room_id: str
    item_id: UUID
    user_1_id: UUID
    user_1_filter_id: str
    user_2_id: UUID
    user_2_filter_id: str
