from typing import Optional
from app.core.schemas.inbound import InboundBase


from pydantic import Field


from uuid import UUID


class RatingIn(InboundBase):
    rater_id: Optional[UUID] = None
    item_id: Optional[UUID] = None
    rating: Optional[int] = Field(default=None, ge=1, le=5)
    comment: Optional[str] = None
