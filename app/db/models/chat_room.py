from datetime import datetime, timezone
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from app.db.base import Base
from sqlalchemy import DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from app.db.models.item import ItemDB
    from app.db.models.user import UserDB


class ChatRoomDB(Base):
    __tablename__ = "chat_rooms"

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )
    __table_args__ = (UniqueConstraint("item_id", "buyer_id"),)

    item_id: Mapped[UUID] = mapped_column(ForeignKey("items.id"), nullable=False)
    item: Mapped["ItemDB"] = relationship(
        "ItemDB", foreign_keys=[item_id], lazy="selectin", uselist=False
    )

    buyer_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )
    buyer: Mapped["UserDB"] = relationship(
        "UserDB", foreign_keys=[buyer_id], lazy="selectin", uselist=False
    )

    seller_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )
    seller: Mapped["UserDB"] = relationship(
        "UserDB", foreign_keys=[seller_id], lazy="selectin", uselist=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


class ChatRoomStatusDB(Base):
    __tablename__ = "chat_room_status"

    user_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True
    )
    user: Mapped["UserDB"] = relationship(
        "UserDB", foreign_keys=[user_id], lazy="selectin", uselist=False
    )

    room_id: Mapped[UUID] = mapped_column(ForeignKey("chat_rooms.id"), primary_key=True)
    room: Mapped["ChatRoomDB"] = relationship(
        "ChatRoomDB", foreign_keys=[room_id], lazy="selectin", uselist=False
    )

    last_read: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
