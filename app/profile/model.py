from datetime import datetime, timezone
from typing import TYPE_CHECKING, List, Optional
from uuid import UUID, uuid4

from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Column, DateTime, Field, Relationship, SQLModel

from app.profile.schemas.common import ProfileExtra

if TYPE_CHECKING:
    from app.item.model import ItemDB


class ProfileDB(SQLModel, table=True):
    __tablename__ = "profiles"  # type: ignore

    id: UUID = Field(default_factory=uuid4, primary_key=True)

    # Fields that must be provided / required fields
    user_id: UUID = Field(nullable=False, index=True, unique=True)
    email: str = Field(nullable=False, index=True, unique=True)
    handle: str = Field(nullable=False, index=True, unique=True)

    rating: float = Field(default=0.0, nullable=False)
    rating_count: int = Field(default=0, nullable=False)

    postcode: Optional[str] = Field(default=None, nullable=True)
    avatar_url: Optional[str] = Field(default=None, nullable=True)

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )

    extra: dict = Field(default_factory=dict, sa_column=Column(JSONB))

    # Relationship
    items: List["ItemDB"] = Relationship(
        back_populates="profile",
        sa_relationship_kwargs={"lazy": "selectin"},
    )
