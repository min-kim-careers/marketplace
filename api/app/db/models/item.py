from datetime import datetime, timezone
from typing import TYPE_CHECKING, Optional
from uuid import UUID, uuid4

from sqlalchemy import ARRAY, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.db.base import Base

from app.item.enums import ItemCategory, ItemCondition, ItemStatus
from sqlalchemy.dialects.postgresql import UUID as PG_UUID

if TYPE_CHECKING:
    from app.db.models.user import UserDB


class ItemDB(Base):
    __tablename__ = "items"

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid4
    )

    # Required fields
    name: Mapped[str] = mapped_column(nullable=False)
    description: Mapped[str] = mapped_column(nullable=False)
    price: Mapped[float] = mapped_column(nullable=False)
    brand: Mapped[Optional[str]] = mapped_column(nullable=True)

    category: Mapped[ItemCategory] = mapped_column(String, nullable=False)
    condition: Mapped[ItemCondition] = mapped_column(String, nullable=False)
    status: Mapped[ItemStatus] = mapped_column(
        String, default=ItemStatus.available, nullable=False
    )

    postcode: Mapped[str] = mapped_column(nullable=False)
    suburb: Mapped[str] = mapped_column(nullable=False)
    state: Mapped[str] = mapped_column(nullable=False)

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
    expires_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)

    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    user: Mapped["UserDB"] = relationship(
        "UserDB",
        lazy="selectin",
        foreign_keys=[user_id],
    )

    buyer_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id"),
        nullable=True,
    )
    buyer: Mapped["UserDB"] = relationship(
        "UserDB",
        lazy="selectin",
        foreign_keys=[buyer_id],
    )

    image_filenames: Mapped[list[str]] = mapped_column(ARRAY(String), default=[])


#     images: Mapped[list["ItemImageDB"]] = relationship(
#         "ItemImageDB",
#         back_populates="item",
#         cascade="all, delete-orphan",
#         order_by="ItemImageDB.index",
#         lazy="selectin",
#     )


# class ItemImageDB(Base):
#     __tablename__ = "item_images"

#     __table_args__ = (UniqueConstraint("item_id", "index"),)

#     id: Mapped[UUID] = mapped_column(
#         PG_UUID(as_uuid=True), primary_key=True, default=uuid4
#     )

#     index: Mapped[int] = mapped_column(nullable=False)
#     filename: Mapped[str] = mapped_column(nullable=False)

#     item_id: Mapped[UUID] = mapped_column(
#         ForeignKey("items.id", ondelete="CASCADE"),
#         nullable=False,
#     )
#     item: Mapped["ItemDB"] = relationship(
#         "ItemDB",
#         lazy="selectin",
#         foreign_keys=[item_id],
#     )

#     created_at: Mapped[datetime] = mapped_column(
#         DateTime(timezone=True),
#         default=lambda: datetime.now(timezone.utc),
#         nullable=False,
#     )
#     updated_at: Mapped[datetime] = mapped_column(
#         DateTime(timezone=True),
#         default=lambda: datetime.now(timezone.utc),
#         nullable=False,
#     )
