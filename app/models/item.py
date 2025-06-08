from typing import TYPE_CHECKING, List, Optional
from datetime import datetime, timezone
from sqlmodel import (
    ARRAY,
    JSON,
    Column,
    DateTime,
    SQLModel,
    Field,
    Relationship,
    String,
)
from uuid import UUID

if TYPE_CHECKING:
    from app.models.profile import Profile


class Item(SQLModel, table=True):
    __tablename__ = "items"  # type: ignore

    id: int = Field(default=None, primary_key=True)

    name: str = Field(nullable=False)
    description: str = Field(nullable=False)
    price: float = Field(nullable=False)
    category: str = Field(nullable=False)
    condition: str = Field(nullable=False)
    postcode: str = Field(nullable=False)

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )
    expires_at: Optional[datetime] = None

    image_urls: List[str] = Field(
        sa_column=Column(ARRAY(String)),
        default_factory=list,
    )

    profile_id: UUID = Field(foreign_key="profiles.id", nullable=False)
    profile: "Profile" = Relationship(back_populates="items")
