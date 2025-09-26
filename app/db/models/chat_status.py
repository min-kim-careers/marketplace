from typing import TYPE_CHECKING
from app.db.base import Base
from app.db.models.chat_room import ChatRoomDB
from app.db.models.user import UserDB


from sqlalchemy import DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship


from datetime import datetime, timezone
from uuid import UUID

if TYPE_CHECKING:
    from app.db.models.chat_room import ChatRoomDB
    from app.db.models.user import UserDB


class ChatStatusDB(Base):
    __tablename__ = "chat_statuses"

    user_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        primary_key=True,
    )
    user: Mapped["UserDB"] = relationship(
        "UserDB",
        foreign_keys=[user_id],
        lazy="selectin",
        uselist=False,
    )

    room_id: Mapped[UUID] = mapped_column(
        ForeignKey("chat_rooms.id", ondelete="CASCADE"),
        primary_key=True,
    )
    room: Mapped["ChatRoomDB"] = relationship(
        "ChatRoomDB",
        foreign_keys=[room_id],
        lazy="selectin",
        uselist=False,
    )

    last_read: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
