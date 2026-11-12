from datetime import datetime, timedelta, timezone
from typing import Optional
from uuid import UUID

from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logger import log_class_exceptions, logger
from app.db.models.profile import ProfileDB
from app.item.utils.image import remove_image, store_image
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
    def _remove_local_avatar(avatar_url: Optional[str]):
        """Delete a previously uploaded avatar file; external urls are ignored."""
        if not avatar_url or "://" in avatar_url:
            return
        try:
            remove_image(avatar_url)
        except FileNotFoundError:
            logger.warning(f"Avatar file {avatar_url} already missing")

    @staticmethod
    async def update_avatar(
        db: AsyncSession,
        profile_db: ProfileDB,
        avatar: UploadFile,
    ) -> ProfileOut:
        old_avatar = profile_db.avatar_url
        filename = await store_image(avatar)
        try:
            profile_db.avatar_url = filename
            await db.commit()
            await db.refresh(profile_db)
        except Exception:
            await db.rollback()
            remove_image(filename)
            raise

        ProfileService._remove_local_avatar(old_avatar)
        return ProfileOut.model_validate(profile_db, from_attributes=True)

    @staticmethod
    async def remove_avatar(db: AsyncSession, profile_db: ProfileDB) -> ProfileOut:
        old_avatar = profile_db.avatar_url
        try:
            profile_db.avatar_url = None
            await db.commit()
            await db.refresh(profile_db)
        except Exception:
            await db.rollback()
            raise

        ProfileService._remove_local_avatar(old_avatar)
        return ProfileOut.model_validate(profile_db, from_attributes=True)

    @staticmethod
    async def get_profile_extra(
        db: AsyncSession,
        user_id: UUID,
    ):
        profile_db = await ProfileRepository.get_by_user_id(db, user_id)

        return ProfileExtraOut.from_db(profile_db.extra)
