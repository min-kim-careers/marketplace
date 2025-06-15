from datetime import datetime, timezone
from typing import TYPE_CHECKING, List, Optional
from uuid import UUID

from sqlmodel import ARRAY, Column, DateTime
from sqlmodel import Enum as SqlEnum
from sqlmodel import Field, Relationship, SQLModel, String

from app.item.enums import ItemCategory, ItemCondition

if TYPE_CHECKING:
    from app.profile.model import ProfileDB


class ItemDB(SQLModel, table=True):
    __tablename__ = "items"  # type: ignore

    id: Optional[int] = Field(default=None, primary_key=True)

    # Fields that must be provided / required fields
    profile_id: UUID = Field(foreign_key="profiles.id", nullable=False)
    name: str = Field(nullable=False)
    description: str = Field(nullable=False)
    price: float = Field(nullable=False)
    brand: str = Field(default=None, nullable=True)
    category: ItemCategory = Field(nullable=False)
    condition: ItemCondition = Field(nullable=False)
    postcode: str = Field(nullable=False)

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )
    expires_at: Optional[datetime] = Field(default=None, nullable=True)

    image_urls: List[str] = Field(
        default_factory=list,
        sa_column=Column(ARRAY(String)),
    )

    # Relationship
    profile: "ProfileDB" = Relationship(
        back_populates="items",
        sa_relationship_kwargs={"lazy": "selectin"},
    )
