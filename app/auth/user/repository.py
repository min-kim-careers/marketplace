from datetime import datetime
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from app.core import logger
from app.core.utils import get_one_by
from app.db.models.profile import ProfileDB
from app.db.models.user import UserDB
from app.auth.user.schemas.inbound import UserInDB
from app.profile.constants.defaults import default_profile_extra
from app.profile.schemas.inbound import ProfileInCreateDB


class UserRepository:
    @staticmethod
    async def get_user_by_user_id(db: AsyncSession, user_id: UUID) -> UserDB | None:
        return await get_one_by(db, UserDB, user_id=user_id)

    @staticmethod
    async def get_user_by_provider_id(
        db: AsyncSession, provider_id: str
    ) -> UserDB | None:
        return await get_one_by(db, UserDB, provider_id=provider_id)

    # @staticmethod
    # async def create_user(db: AsyncSession, user_in: UserInDB) -> UserDB | None:
    #     try:
    #         new_user = UserDB(
    #             **user_in.model_dump(exclude_unset=True),
    #         )
    #         db.add(new_user)
    #         await db.commit()
    #         await db.refresh(new_user)
    #         return new_user
    #     except Exception as e:
    #         await db.rollback()
    #         logger.info(e)
    #         return None

    @staticmethod
    async def create_user_with_profile(
        db: AsyncSession, user_in: UserInDB, profile_in: ProfileInCreateDB
    ) -> UserDB | None:
        try:
            new_user = UserDB(**user_in.model_dump(exclude_unset=True))
            db.add(new_user)
            await db.flush()

            new_profile = ProfileDB(
                **profile_in.model_dump(exclude_unset=True),
                user_id=new_user.id,
                extra=default_profile_extra(),
            )
            db.add(new_profile)

            await db.commit()
            await db.refresh(new_user)
            return new_user
        except Exception as e:
            await db.rollback()
            logger.info(e)
            return None

    @staticmethod
    async def delete_user(db: AsyncSession, user_db: UserDB) -> bool:
        try:
            await db.delete(user_db)
            await db.commit()
            return True
        except Exception as e:
            await db.rollback()
            logger.info(e)
            return False
