from datetime import datetime
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core import logger, utils
from app.db.models.profile import ProfileDB
from app.db.models.profile_extra import ProfileExtraDB
from app.profile.constants.defaults import default_profile_extra
from app.profile.schemas.inbound import ProfileIn, ProfileInCreateDB, ProfileInUpdateDB


class ProfileRepository:
    @staticmethod
    async def get_by_user_id(db: AsyncSession, user_id: UUID) -> ProfileDB | None:
        return await utils.get_one_by(db, ProfileDB, user_id=user_id)

    @staticmethod
    async def get_by_handle(db: AsyncSession, handle: str) -> ProfileDB | None:
        return await utils.get_one_by(db, ProfileDB, handle=handle)

    @staticmethod
    async def exists_by_handle(db: AsyncSession, handle: str) -> bool:
        return await utils.get_exists_by(db, ProfileDB, handle=handle)

    @staticmethod
    async def exists_by_email(db: AsyncSession, email: str) -> bool:
        return await utils.get_exists_by(db, ProfileDB, email=email)

    @staticmethod
    async def create(
        db: AsyncSession, user_id: UUID, profile_in: ProfileInCreateDB
    ) -> ProfileDB | None:
        try:
            profile_db = ProfileDB(
                **profile_in.model_dump(
                    exclude_unset=True,
                ),
                user_id=user_id,
                extra=default_profile_extra()
            )

            db.add(profile_db)
            await db.commit()
            await db.refresh(profile_db)
            return profile_db
        except Exception as e:
            await db.rollback()
            logger.info(e)
            return None

    @staticmethod
    async def update(
        db: AsyncSession, profile_db: ProfileDB, profile_in: ProfileInUpdateDB
    ) -> ProfileDB | None:
        try:
            for field, value in profile_in.model_dump(
                exclude_unset=True,
                exclude_none=True,
            ).items():
                setattr(profile_db, field, value)

            await db.commit()
            await db.refresh(profile_db)
            return profile_db
        except Exception as e:
            await db.rollback()
            logger.info(e)
            return None
