from datetime import datetime
from typing import Optional

from app.core.schemas.outbound import OutboundBase
from app.db.models.profile_extra import ProfileExtraDB


class ProfileExtraOut(OutboundBase):
    image_limit: int
    listing_limit: int
    can_update_handle: bool
    next_handle_update_in_days: int

    @classmethod
    def from_db(cls, p: ProfileExtraDB) -> "ProfileExtraOut":
        can_update_handle = p.next_handle_update < datetime.now()
        next_handle_update_in_days = (
            0 if can_update_handle else (p.next_handle_update - datetime.now()).days
        )
        return cls.model_validate(
            {
                **p.__dict__,
                "can_update_handle": can_update_handle,
                "next_handle_update_in_days": next_handle_update_in_days,
            },
            from_attributes=True,
        )


class ProfileOut(OutboundBase):
    email: str
    handle: str
    rating: float
    rating_count: int
    postcode: Optional[str] = None
    suburb: Optional[str] = None
    state: Optional[str] = None
    avatar_url: Optional[str] = None
