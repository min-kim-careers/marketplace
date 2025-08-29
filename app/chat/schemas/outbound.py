from app.core.helpers import encode_uuid
from app.core.schemas.outbound import OutboundBase
from app.db.models.chat_room import ChatRoomDB


class ChatRoomOut(OutboundBase):
    alias: str

    @classmethod
    def from_db(cls, room: ChatRoomDB) -> "ChatRoomOut":
        return cls.model_validate(
            {
                "alias": encode_uuid(room.id),
            },
            from_attributes=True,
        )
