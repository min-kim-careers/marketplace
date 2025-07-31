from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.utils import get_one_by
from app.core.db.models.user import UserDB
from app.auth.user.schemas.inbound import UserInDB


class UserRepository:
    @staticmethod
    async def get_user_by_user_id(db: AsyncSession, user_id: UUID) -> UserDB | None:
        return await get_one_by(db, UserDB, user_id=user_id)

    @staticmethod
    async def get_user_by_provider_id(
        db: AsyncSession, provider_id: str
    ) -> UserDB | None:
        return await get_one_by(db, UserDB, provider_id=provider_id)

    @staticmethod
    async def create_user(db: AsyncSession, user_in: UserInDB) -> UserDB | None:
        try:
            user_db = UserDB(
                **user_in.model_dump(exclude_unset=True),
            )
            db.add(user_db)
            await db.commit()
            await db.refresh(user_db)
            return user_db
        except Exception as e:
            await db.rollback()
            print(e)
            return None
