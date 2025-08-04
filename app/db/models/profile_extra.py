from app.db.base import Base


from sqlalchemy import ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column


from datetime import datetime
from uuid import UUID


class ProfileExtraDB(Base):
    __tablename__ = "profile_extras"

    profile_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("profiles.id", ondelete="CASCADE"),
        primary_key=True,
    )

    image_limit: Mapped[int] = mapped_column(nullable=False)
    listing_limit: Mapped[int] = mapped_column(nullable=False)
    next_handle_update: Mapped[datetime] = mapped_column(nullable=False)