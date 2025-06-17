from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from sqlalchemy import String, DateTime, ForeignKey, Enum, ARRAY
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.db.base import Base
from app.item.enums import ItemCategory, ItemCondition, ItemStatus


class ItemDB(Base):
    __tablename__ = "items"

    id: Mapped[int] = mapped_column(primary_key=True)

    profile_id: Mapped[UUID] = mapped_column(ForeignKey("profiles.id"), nullable=False)
    user_id: Mapped[UUID] = mapped_column(nullable=False)

    name: Mapped[str] = mapped_column(nullable=False)
    description: Mapped[str] = mapped_column(nullable=False)
    price: Mapped[float] = mapped_column(nullable=False)
    brand: Mapped[Optional[str]] = mapped_column(nullable=True)
    category: Mapped[ItemCategory] = mapped_column(Enum(ItemCategory), nullable=False)
    condition: Mapped[ItemCondition] = mapped_column(
        Enum(ItemCondition), nullable=False
    )
    postcode: Mapped[str] = mapped_column(nullable=False)

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

    status: Mapped[ItemStatus] = mapped_column(
        Enum(ItemStatus), default=ItemStatus.available, nullable=False
    )

    image_urls: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)

    # Relationship
    profile = relationship("ProfileDB", back_populates="items", lazy="selectin")
