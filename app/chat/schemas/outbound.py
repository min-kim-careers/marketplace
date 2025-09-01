from app.core.helpers import encode_uuid
from app.core.schemas.outbound import OutboundBase
from app.db.models.chat_room import ChatRoomDB
from app.item.schemas.outbound import ItemOut


class ChatRoomOut(OutboundBase):
    alias: str
    item: ItemOut

    @classmethod
    def from_db(cls, room: ChatRoomDB) -> "ChatRoomOut":
        return cls.model_validate(
            {
                "alias": encode_uuid(room.id),
                "item": ItemOut.from_db(room.item),
            },
            from_attributes=True,
        )
