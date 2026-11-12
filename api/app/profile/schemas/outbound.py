from datetime import datetime, timezone
from typing import Dict, Optional

from pydantic import field_validator

from app.core import env
from app.core.schemas.outbound import OutboundBase
from app.db.models.profile_extra import ProfileExtraDB
from app.profile.constants.defaults import (
    DEFAULT_EMAIL_UPDATE_INTERVAL_IN_DAYS,
    DEFAULT_HANDLE_UPDATE_INTERVAL_IN_DAYS,
)


class UpdateConstraint(OutboundBase):
    can_update: bool = False
    next_update_in_days: int = 0
    interval_in_days: int = 0


class ProfileExtraOut(OutboundBase):
    image_limit: int
    listing_limit: int
    update_constraints: Dict[str, UpdateConstraint]

    @staticmethod
    def get_update_constraint(
        next_update: datetime, interval_in_days: int
    ) -> UpdateConstraint:
        can_update = next_update < datetime.now(timezone.utc)
        return UpdateConstraint(
            can_update=can_update,
            next_update_in_days=(
                0 if can_update else (next_update - datetime.now(timezone.utc)).days
            ),
            interval_in_days=interval_in_days,
        )

    @classmethod
    def from_db(cls, extra: ProfileExtraDB) -> "ProfileExtraOut":
        return cls.model_validate(
            {
                **extra.__dict__,
                "update_constraints": {
                    "handle": cls.get_update_constraint(
                        extra.next_handle_update, DEFAULT_HANDLE_UPDATE_INTERVAL_IN_DAYS
                    ),
                    "email": cls.get_update_constraint(
                        extra.next_email_update, DEFAULT_EMAIL_UPDATE_INTERVAL_IN_DAYS
                    ),
                },
            },
            from_attributes=True,
        )


class ProfileOut(OutboundBase):
    email: str
    handle: str
    # rating: float
    # rating_count: int
    # postcode: Optional[str] = None
    # suburb: Optional[str] = None
    # state: Optional[str] = None
    avatar_url: Optional[str] = None

    @field_validator("avatar_url")
    @classmethod
    def resolve_avatar_url(cls, v: Optional[str]) -> Optional[str]:
        # uploaded avatars are stored as bare filenames; external urls pass through
        if v and "://" not in v and not v.startswith(env.FRONTEND_IMAGE_BASE):
            return env.FRONTEND_IMAGE_BASE + "/" + v
        return v
