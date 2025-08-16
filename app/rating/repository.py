from typing import Sequence
from uuid import UUID
from app.core import logger
from app.core.utils import get_one_by
from app.db.models.rating import RatingDB

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.rating.schemas.inbound import RatingIn


class RatingRepository:
    @staticmethod
    async def get_rating_by_rater(
        db: AsyncSession, user_id: UUID
    ) -> RatingDB | None:
        return await get_one_by(db, RatingDB, rater_id=user_id)

    @staticmethod
    async def get_rating_by_ratee(
        db: AsyncSession, user_id: UUID
    ) -> RatingDB | None:
        return await get_one_by(db, RatingDB, ratee_id=user_id)

    @staticmethod
    async def get_rating_by_item(
        db: AsyncSession, item_id: UUID
    ) -> RatingDB | None:
        return await get_one_by(db, RatingDB, item_id=item_id)

    @staticmethod
    async def get_ratings(db: AsyncSession) -> Sequence[RatingDB] | None:
        try:
            stmt = select(RatingDB)
            result = await db.execute(stmt)
            return result.scalars().all()
        except Exception as e:
            await db.rollback()
            logger.info(e)
            return None

    @staticmethod
    async def create_rating(
        db: AsyncSession, user_id: UUID, rating_in: RatingIn
    ) -> RatingDB | None:
        try:
            rating_db = RatingDB(
                ratee_id=user_id,
                **rating_in.model_dump(exclude_unset=True),
            )

            db.add(rating_db)
            await db.commit()
            await db.refresh(rating_db)
            return rating_db
        except Exception as e:
            await db.rollback()
            logger.info(e)
            return None

    @staticmethod
    async def update_rating(
        db: AsyncSession, rating_db: RatingDB, rating_in: RatingIn
    ) -> RatingDB | None:
        try:
            for field, value in rating_in.model_dump(exclude_unset=True).items():
                setattr(rating_db, field, value)

            await db.commit()
            await db.refresh(rating_db)
            return rating_db
        except Exception as e:
            await db.rollback()
            logger.info(e)
            return None
