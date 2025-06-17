from datetime import datetime, timezone
from typing import Optional
from uuid import UUID, uuid4

from sqlalchemy import DateTime, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.db.base import Base


class ProfileDB(Base):
    __tablename__ = "profiles"
    __table_args__ = (
        UniqueConstraint("user_id"),
        UniqueConstraint("email"),
        UniqueConstraint("handle"),
    )

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)

    user_id: Mapped[UUID] = mapped_column(nullable=False, index=True)
    email: Mapped[str] = mapped_column(nullable=False, index=True)
    handle: Mapped[str] = mapped_column(nullable=False, index=True)

    rating: Mapped[float] = mapped_column(default=0.0, nullable=False)
    rating_count: Mapped[int] = mapped_column(default=0, nullable=False)

    postcode: Mapped[Optional[str]] = mapped_column(nullable=True)
    avatar_url: Mapped[Optional[str]] = mapped_column(nullable=True)

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

    extra: Mapped[dict] = mapped_column(JSONB, default=dict)

    # Relationship to items
    items = relationship(
        "ItemDB",
        back_populates="profile",
        lazy="selectin",
        cascade="all, delete-orphan",
    )
