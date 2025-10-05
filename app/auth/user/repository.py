from uuid import UUID

from app.auth.user.schemas.internal import UserInDB
from app.core.helpers import get_one_by
from app.core.logger import log_class_exceptions
from app.db.models.profile import ProfileDB
from app.db.models.user import UserDB
from app.profile.constants.defaults import default_profile_extra
from app.profile.schemas.internal import ProfileInCreateDB
from sqlalchemy.ext.asyncio import AsyncSession


@log_class_exceptions
class UserRepository:
    @staticmethod
    async def get_user_by_id(db: AsyncSession, user_id: UUID) -> UserDB:
        return await get_one_by(db, UserDB, user_id=user_id)

    @staticmethod
    async def get_user_by_provider(db: AsyncSession, provider_id: str) -> UserDB:
        return await get_one_by(db, UserDB, provider_id=provider_id)

    @staticmethod
    async def create_user_with_profile(
        db: AsyncSession, user_in: UserInDB, profile_in: ProfileInCreateDB
    ) -> UserDB:
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
        except Exception:
            await db.rollback()
            raise

    @staticmethod
    async def delete_user(db: AsyncSession, user_db: UserDB):
        try:
            await db.delete(user_db)
            await db.commit()
        except Exception:
            await db.rollback()
            raise
