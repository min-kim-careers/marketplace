from datetime import datetime, timedelta, timezone
from typing import Optional
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.schemas.error import ErrorResponse
from app.db.models.profile import ProfileDB
from app.profile.constants.defaults import (
    DEFAULT_EMAIL_UPDATE_INTERVAL_IN_DAYS,
    DEFAULT_HANDLE_UPDATE_INTERVAL_IN_DAYS,
)
from app.profile.repository import ProfileRepository
from app.profile.schemas.inbound import ProfileIn, ProfileInCreateDB, ProfileInUpdateDB
from app.profile.schemas.outbound import ProfileExtraOut, ProfileOut


class ProfileService:
    @staticmethod
    async def upsert_profile(
        db: AsyncSession,
        profile_db: ProfileDB,
        profile_in: ProfileIn,
        user_id: Optional[UUID] = None,
    ):
        new_profile_db = None
        if not user_id:
            if profile_in.handle:
                profile_db.extra.next_handle_update = datetime.now(
                    timezone.utc
                ) + timedelta(days=DEFAULT_HANDLE_UPDATE_INTERVAL_IN_DAYS)
            if profile_in.email:
                profile_db.extra.next_email_update = datetime.now(
                    timezone.utc
                ) + timedelta(days=DEFAULT_EMAIL_UPDATE_INTERVAL_IN_DAYS)

            new_profile_db = await ProfileRepository.update(
                db,
                profile_db,
                ProfileInUpdateDB.model_validate(
                    profile_in,
                    from_attributes=True,
                ),
            )
        else:
            new_profile_db = await ProfileRepository.create(
                db,
                user_id,
                ProfileInCreateDB.model_validate(
                    profile_in,
                    from_attributes=True,
                ),
            )

        if not new_profile_db:
            raise ErrorResponse(status_code=500, message="Failed to upsert profile")

        return ProfileOut.model_validate(profile_db, from_attributes=True)

    @staticmethod
    async def get_profile_extra(
        db: AsyncSession,
        user_id: UUID,
    ):
        profile_db = await ProfileRepository.get_by_user_id(db, user_id)
        if not profile_db:
            return None

        return ProfileExtraOut.from_db(profile_db.extra)
