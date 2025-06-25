from typing import Sequence
from uuid import UUID
from app.common.utils import get_one_by
from app.db.models.rating import RatingDB

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.profile.schemas.inbound import RatingIn


class RatingRepository:
    @staticmethod
    async def get_rating_by_rater(
        session: AsyncSession, user_id: UUID
    ) -> RatingDB | None:
        return await get_one_by(session, RatingDB, rater_id=user_id)

    @staticmethod
    async def get_rating_by_ratee(
        session: AsyncSession, user_id: UUID
    ) -> RatingDB | None:
        return await get_one_by(session, RatingDB, ratee_id=user_id)

    @staticmethod
    async def get_rating_by_item(
        session: AsyncSession, item_id: UUID
    ) -> RatingDB | None:
        return await get_one_by(session, RatingDB, item_id=item_id)

    @staticmethod
    async def get_ratings(session: AsyncSession) -> Sequence[RatingDB] | None:
        try:
            stmt = select(RatingDB)
            result = await session.execute(stmt)
            return result.scalars().all()
        except Exception as e:
            await session.rollback()
            print(e)
            return None

    @staticmethod
    async def create_rating(
        session: AsyncSession, user_id: UUID, rating_in: RatingIn
    ) -> RatingDB | None:
        try:
            rating_db = RatingDB(
                ratee_id=user_id,
                **rating_in.model_dump(exclude_unset=True),
            )

            session.add(rating_db)
            await session.commit()
            await session.refresh(rating_db)
            return rating_db
        except Exception as e:
            await session.rollback()
            print(e)
            return None

    @staticmethod
    async def update_rating(
        session: AsyncSession, rating_db: RatingDB, rating_in: RatingIn
    ) -> RatingDB | None:
        try:
            for field, value in rating_in.model_dump(exclude_unset=True).items():
                setattr(rating_db, field, value)

            await session.commit()
            await session.refresh(rating_db)
            return rating_db
        except Exception as e:
            await session.rollback()
            print(e)
            return None
