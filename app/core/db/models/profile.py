from datetime import datetime, timezone
from typing import TYPE_CHECKING, Optional
from uuid import UUID, uuid4

from sqlalchemy import DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.core.db.base import Base
from sqlalchemy.dialects.postgresql import UUID as PG_UUID

if TYPE_CHECKING:
    from app.core.db.models.user import UserDB


class ProfileDB(Base):
    __tablename__ = "profiles"
    __table_args__ = (
        UniqueConstraint("email"),
        UniqueConstraint("handle"),
    )

    id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid4)

    email: Mapped[str] = mapped_column(nullable=False, index=True)
    handle: Mapped[str] = mapped_column(nullable=False, index=True)

    rating: Mapped[float] = mapped_column(default=0.0, nullable=False)
    rating_count: Mapped[int] = mapped_column(default=0, nullable=False)

    postcode: Mapped[str] = mapped_column(nullable=True)
    suburb: Mapped[str] = mapped_column(nullable=True)
    state: Mapped[str] = mapped_column(nullable=True)

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

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    user: Mapped["UserDB"] = relationship(
        "UserDB", lazy="selectin", foreign_keys=[user_id]
    )
