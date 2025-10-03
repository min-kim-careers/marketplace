from typing import Optional
from uuid import UUID
from app.core import env
from app.core.helpers import encode_uuid
from app.core.schemas.outbound import OutboundBase
from app.db.models.chat_room import ChatRoomDB
from app.db.models.item import ItemDB
from app.item.enums import ItemStatus
from app.profile.schemas.outbound import ProfileOut


class ChatRoomItemOut(OutboundBase):
    alias: str
    name: str
    price: float
    image_url: Optional[str] = None
    status: ItemStatus
    is_deleted: bool

    @classmethod
    def from_db(cls, item: ItemDB) -> "ChatRoomItemOut":
        return ChatRoomItemOut(
            name=item.name,
            price=item.price,
            image_url=(
                env.FRONTEND_IMAGE_BASE + "/" + item.image_filenames[0]
                if len(item.image_filenames) > 0
                else None
            ),
            alias=encode_uuid(item.id),
            status=item.status,
            is_deleted=item.status == ItemStatus.deleted,
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
