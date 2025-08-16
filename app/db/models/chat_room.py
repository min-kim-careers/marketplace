from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.db.base import Base
from sqlalchemy.dialects.postgresql import UUID as PG_UUID


if TYPE_CHECKING:
    from app.db.models.item import ItemDB
    from app.db.models.user import UserDB


class ChatRoomDB(Base):
    __tablename__ = "chat_rooms"
    __table_args__ = (
        UniqueConstraint("room_id", "user_1_id", "user_2_id"),
        UniqueConstraint("room_id", "user_2_id", "user_1_id"),
    )

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )

    room_id: Mapped[str] = mapped_column(
        unique=True,
        nullable=False,
    )

    item_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("items.id"), nullable=False
    )
    item: Mapped["ItemDB"] = relationship(
        "ItemDB",
        foreign_keys=[item_id],
        lazy="selectin",
        uselist=False,
    )

    user_1_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )
    user_1: Mapped["UserDB"] = relationship(
        "UserDB",
        foreign_keys=[user_1_id],
        lazy="selectin",
        uselist=False,
    )

    user_2_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )
    user_2: Mapped["UserDB"] = relationship(
        "UserDB",
        foreign_keys=[user_2_id],
        lazy="selectin",
        uselist=False,
    )
