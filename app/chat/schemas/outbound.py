from uuid import UUID
from app.core.helpers import encode_uuid
from app.core.schemas.outbound import OutboundBase
from app.db.models.chat_room import ChatRoomDB
from app.db.models.item import ItemDB
from app.profile.schemas.outbound import ProfileOut


class ChatRoomItemOut(OutboundBase):
    alias: str
    name: str
    profile: ProfileOut

    @classmethod
    def from_db(cls, item: ItemDB) -> "ChatRoomItemOut":
        return cls.model_validate(
            {
                "name": item.name,
                "alias": encode_uuid(item.id),
                "profile": ProfileOut.model_validate(
                    item.user.profile, from_attributes=True
                ),
            },
            from_attributes=True,
        )


class ChatRoomOut(OutboundBase):
    alias: str
    is_seller: bool
    item: ChatRoomItemOut

    @classmethod
    def from_db(cls, room: ChatRoomDB, user_id: UUID) -> "ChatRoomOut":
        return cls.model_validate(
            {
                "alias": encode_uuid(room.id),
                "is_seller": user_id == room.item.user_id,
                "item": ChatRoomItemOut.from_db(room.item),
            },
            from_attributes=True,
        )
