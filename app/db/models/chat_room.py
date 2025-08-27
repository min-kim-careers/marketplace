from typing import TYPE_CHECKING
from uuid import UUID

from app.db.base import Base
from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from app.db.models.item import ItemDB
    from app.db.models.user import UserDB


class ChatRoomDB(Base):
    __tablename__ = "chat_rooms"
    __table_args__ = (
        UniqueConstraint("item_id", "user_1_id", "user_2_id"),
        UniqueConstraint("item_id", "user_2_id", "user_1_id"),
    )

    id: Mapped[str] = mapped_column(
        primary_key=True,
    )

    item_id: Mapped[str] = mapped_column(ForeignKey("items.id"), nullable=False)

    user_1_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )
    user_1_filter_id: Mapped[str] = mapped_column(nullable=True)

    user_2_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )
    user_2_filter_id: Mapped[str] = mapped_column(nullable=True)

    item: Mapped["ItemDB"] = relationship(
        "ItemDB",
        foreign_keys=[item_id],
        lazy="selectin",
        uselist=False,
    )
    user_1: Mapped["UserDB"] = relationship(
        "UserDB",
        foreign_keys=[user_1_id],
        lazy="selectin",
        uselist=False,
    )
    user_2: Mapped["UserDB"] = relationship(
        "UserDB",
        foreign_keys=[user_2_id],
        lazy="selectin",
        uselist=False,
    )
