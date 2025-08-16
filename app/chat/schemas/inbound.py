from uuid import UUID
from pydantic import BaseModel, model_validator


class ChatRoomInDB(BaseModel):
    room_id: str
    item_id: UUID
    user_ids: list[UUID]

    @model_validator(mode="after")
    def sort_user_ids(self):
        self.user_ids = sorted(self.user_ids)
        return self
