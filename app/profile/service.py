from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.profile.repository import ProfileRepository
from app.profile.schemas.inbound import ProfileIn, ProfileInDB
from app.profile.schemas.outbound import ProfileExtra, ProfileOut


class ProfileService:
    @staticmethod
    async def upsert_profile(
        db: AsyncSession,
        user_id: UUID,
        profile_in: ProfileIn,
    ):
        profile_db = await ProfileRepository.get_by_user_id(db, user_id)
        if profile_db:
            profile_db = await ProfileRepository.update(db, profile_db, profile_in)
        else:
            profile_db = await ProfileRepository.create(
                db, user_id, ProfileInDB.model_validate(profile_in)
            )

        if not profile_db:
            return None

        return ProfileOut.model_validate(profile_db, from_attributes=True)

    @staticmethod
    async def get_profile_extra(
        db: AsyncSession,
        user_id: UUID,
    ):
        profile_db = await ProfileRepository.get_by_user_id(db, user_id)
        if not profile_db:
            return None
        
        return ProfileExtra.model_validate(profile_db.extra)
