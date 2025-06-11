from typing import TYPE_CHECKING, List, Optional
from datetime import datetime, timezone
from sqlmodel import (
    ARRAY,
    Column,
    DateTime,
    SQLModel,
    Field,
    Relationship,
    String,
    Enum as SqlEnum,
)
from uuid import UUID

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
    category: ItemCategory = Field(sa_column=Column(SqlEnum(ItemCategory)))
    condition: ItemCondition = Field(sa_column=Column(SqlEnum(ItemCondition)))
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
