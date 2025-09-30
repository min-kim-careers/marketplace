from typing import Optional
from uuid import UUID
from app.core.helpers import encode_uuid
from app.core.schemas.outbound import OutboundBase
from app.db.models.chat_room import ChatRoomDB
from app.db.models.item import ItemDB
from app.profile.schemas.outbound import ProfileOut


class ChatRoomItemOut(OutboundBase):
    alias: str
    name: str
    price: float
    preview_url: Optional[str] = None

    @classmethod
    def from_db(cls, item: ItemDB) -> "ChatRoomItemOut":
        return ChatRoomItemOut(
            name=item.name,
            price=item.price,
            preview_url=item.filenames[0] if len(item.filenames) > 0 else None,
            alias=encode_uuid(item.id),
        )


class ChatRoomOut(OutboundBase):
    alias: str
    is_seller: bool
    peer: ProfileOut
    item: ChatRoomItemOut
    unread: Optional[bool] = False

    @classmethod
    def from_db(cls, room: ChatRoomDB, user_id: UUID) -> "ChatRoomOut":
        is_seller = user_id == room.item.user_id
        return ChatRoomOut(
            alias=encode_uuid(room.id),
            is_seller=is_seller,
            peer=ProfileOut.model_validate(
                room.buyer.profile if is_seller else room.seller.profile,
                from_attributes=True,
            ),
            item=ChatRoomItemOut.from_db(room.item),
        )
