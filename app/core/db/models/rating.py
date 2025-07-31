from typing import TYPE_CHECKING
from sqlalchemy import (
    Table,
    Column,
    ForeignKey,
    Integer,
    String,
    Text,
    DateTime,
    CheckConstraint,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
import uuid
from datetime import datetime, timezone

from app.core.db.base import Base

if TYPE_CHECKING:
    from app.core.db.models.user import UserDB
    from app.core.db.models.item import ItemDB


class RatingDB(Base):
    __tablename__ = "ratings"
    __table_args__ = (
        UniqueConstraint("rater_id", "ratee_id", "item_id"),
        CheckConstraint("rating BETWEEN 1 AND 5", name="check_rating_range"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    # Required fields
    rater_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )
    rater: Mapped["UserDB"] = relationship(
        "UserDB", lazy="selectin", foreign_keys=[rater_id]
    )

    ratee_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )
    ratee: Mapped["UserDB"] = relationship(
        "UserDB", lazy="selectin", foreign_keys=[ratee_id]
    )

    item_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("items.id"), nullable=False
    )
    item: Mapped["ItemDB"] = relationship(
        "ItemDB", lazy="selectin", foreign_keys=[item_id]
    )

    rating: Mapped[int] = mapped_column(Integer, nullable=False)
    comment: Mapped[str] = mapped_column(Text, nullable=True)

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
