from datetime import datetime, timezone
from typing import TYPE_CHECKING, Optional
from uuid import UUID, uuid4

from sqlalchemy import DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.core.db.base import Base
from sqlalchemy.dialects.postgresql import UUID as PG_UUID

if TYPE_CHECKING:
    from app.core.db.models.profile import ProfileDB


class UserDB(Base):
    __tablename__ = "users"
    __table_args__ = (UniqueConstraint("provider_name", "provider_id"),)

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid4
    )

    provider_name: Mapped[str] = mapped_column(nullable=False)
    provider_id: Mapped[str] = mapped_column(nullable=False)

    profile: Mapped["ProfileDB"] = relationship(
        "ProfileDB", lazy="selectin", back_populates="user", uselist=False
    )
