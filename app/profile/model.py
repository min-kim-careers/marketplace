from typing import TYPE_CHECKING, List, Optional
from datetime import datetime, timezone
from sqlmodel import Column, DateTime, SQLModel, Field, Relationship
from uuid import UUID

if TYPE_CHECKING:
    from app.item.model import ItemDB


class ProfileDB(SQLModel, table=True):
    __tablename__ = "profiles"  # type: ignore

    id: UUID = Field(default_factory=UUID, primary_key=True)

    email: str = Field(nullable=False, index=True, unique=True)
    handle: str = Field(nullable=False, index=True, unique=True)
    
    rating: float = Field(nullable=False)
    rating_count: int = Field(nullable=False)

    postcode: Optional[str] = None
    avatar_url: Optional[str] = None

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )

    items: List["ItemDB"] = Relationship(
        back_populates="profile",
        sa_relationship_kwargs={"lazy": "selectin"},
    )

    user_id: UUID = Field(nullable=False, index=True, unique=True)
