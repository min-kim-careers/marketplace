from datetime import datetime, timedelta, timezone
from typing import Optional
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logger import log_class_exceptions
from app.db.models.profile import ProfileDB
from app.profile.constants.defaults import (
    DEFAULT_EMAIL_UPDATE_INTERVAL_IN_DAYS,
    DEFAULT_HANDLE_UPDATE_INTERVAL_IN_DAYS,
)
from app.profile.repository import ProfileRepository
from app.profile.schemas.internal import ProfileInCreateDB, ProfileInUpdateDB
from app.profile.schemas.inbound import ProfileIn
from app.profile.schemas.outbound import ProfileExtraOut, ProfileOut


@log_class_exceptions
class ProfileService:
    @staticmethod
    async def upsert_profile(
        db: AsyncSession,
        profile_db: ProfileDB,
        profile_in: ProfileIn,
        user_id: Optional[UUID] = None,
    ):
        if not user_id:
            if profile_in.handle:
                profile_db.extra.next_handle_update = datetime.now(
                    timezone.utc
                ) + timedelta(days=DEFAULT_HANDLE_UPDATE_INTERVAL_IN_DAYS)
            if profile_in.email:
                profile_db.extra.next_email_update = datetime.now(
                    timezone.utc
                ) + timedelta(days=DEFAULT_EMAIL_UPDATE_INTERVAL_IN_DAYS)

            await ProfileRepository.update(
                db,
                profile_db,
                ProfileInUpdateDB.model_validate(
                    profile_in,
                    from_attributes=True,
                ),
            )
        else:
            await ProfileRepository.create(
                db,
                user_id,
                ProfileInCreateDB.model_validate(
                    profile_in,
                    from_attributes=True,
                ),
            )

        return ProfileOut.model_validate(profile_db, from_attributes=True)

    @staticmethod
    async def get_profile_extra(
        db: AsyncSession,
        user_id: UUID,
    ):
        profile_db = await ProfileRepository.get_by_user_id(db, user_id)

        return ProfileExtraOut.from_db(profile_db.extra)
