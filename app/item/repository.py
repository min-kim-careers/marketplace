from typing import List, Optional, Sequence
from uuid import UUID

from app.core import logger
from app.core.helpers import get_one_by
from app.db.models.item import ItemDB
from app.item.enums import ItemSortOrder, ItemStatus, ItemUserOption
from app.item.schemas.inbound import ItemInDB, ItemsQuery
from sqlalchemy import Select, String, and_, asc, cast, desc, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession


class ItemRepository:
    @staticmethod
    def build_query(stmt: Select, query: ItemsQuery, user_id: Optional[UUID] = None):
        if query.keyword:
            or_conditions = [
                func.lower(ItemDB.name).ilike(f"%{query.keyword}%"),
                func.lower(ItemDB.description).ilike(f"%{query.keyword}%"),
                func.lower(cast(ItemDB.category, String)).ilike(f"%{query.keyword}%"),
            ]
            stmt = stmt.where(
                or_(*or_conditions),
            )
        if user_id:
            if query.user_option == ItemUserOption.exclude_user:
                stmt = stmt.where(
                    ItemDB.user_id != user_id,
                )
            elif query.user_option == ItemUserOption.user_only:
                stmt = stmt.where(
                    ItemDB.user_id == user_id,
                )
        if query.active_only:
            stmt = stmt.where(
                ItemDB.status.in_(
                    [
                        ItemStatus.available,
                        ItemStatus.pending,
                    ]
                )
            )
        if query.categories:
            stmt = stmt.where(ItemDB.category.in_(query.categories))

        return stmt

    @staticmethod
    async def paginated(
        db: AsyncSession,
        query: ItemsQuery,
        user_id: Optional[UUID] = None,
    ) -> Sequence[ItemDB] | None:
        try:
            stmt = select(ItemDB)

            stmt = ItemRepository.build_query(stmt, query, user_id)

            if query.sort_by:
                sort_column = getattr(ItemDB, query.sort_by.value)
                if query.sort_order == ItemSortOrder.asc:
                    stmt = stmt.order_by(asc(sort_column))
                else:
                    stmt = stmt.order_by(desc(sort_column))

            stmt = stmt.offset(query.offset).limit(query.limit)
            result = await db.execute(stmt)
            return result.scalars().all()
        except Exception as e:
            logger.info(e)
            return None

    @staticmethod
    async def count(
        db: AsyncSession,
        query: ItemsQuery,
        user_id: Optional[UUID] = None,
    ) -> int:
        try:
            stmt = select(func.count()).select_from(ItemDB)

            stmt = ItemRepository.build_query(stmt, query, user_id)

            result = await db.execute(stmt)
            return result.scalar_one()
        except Exception as e:
            logger.info(e)
            return 0

    @staticmethod
    async def count_for_user(
        db: AsyncSession,
        user_id: UUID,
    ) -> int:
        try:
            stmt = (
                select(func.count())
                .select_from(ItemDB)
                .where(ItemDB.user_id == user_id)
            )

            result = await db.execute(stmt)
            return result.scalar_one()
        except Exception as e:
            logger.info(e)
            return 0

    @staticmethod
    async def by_item(
        db: AsyncSession,
        item_id: UUID,
    ) -> ItemDB | None:
        return await get_one_by(
            db,
            ItemDB,
            id=item_id,
        )

    @staticmethod
    async def by_item_and_user(
        db: AsyncSession,
        user_id: UUID,
        item_id: UUID,
    ) -> ItemDB | None:
        return await get_one_by(
            db,
            ItemDB,
            user_id=user_id,
            id=item_id,
        )

    @staticmethod
    async def by_items_and_user(
        db: AsyncSession,
        item_ids: List[UUID],
    ) -> Sequence[ItemDB]:
        try:
            stmt = select(ItemDB).where(
                and_(
                    ItemDB.id.in_(item_ids),
                )
            )
            result = await db.execute(stmt)
            return result.scalars().all()
        except Exception as e:
            logger.info(e)
            return []

    @staticmethod
    async def create(
        db: AsyncSession,
        user_id: UUID,
        item_in_db: ItemInDB,
    ) -> ItemDB | None:
        try:
            item_db = ItemDB(
                **item_in_db.model_dump(),
                user_id=user_id,
            )

            db.add(item_db)
            await db.commit()
            await db.refresh(item_db)
            return item_db
        except Exception as e:
            await db.rollback()
            logger.info(e)
            return None

    @staticmethod
    async def update(
        db: AsyncSession,
        item_db: ItemDB,
        item_in_db: ItemInDB,
    ) -> ItemDB | None:
        try:
            for field, value in item_in_db.model_dump(
                exclude_unset=True, exclude_none=True
            ).items():
                if value:
                    setattr(item_db, field, value)

            await db.commit()
            await db.refresh(item_db)
            return item_db
        except Exception as e:
            await db.rollback()
            logger.info(e)
            return None

    @staticmethod
    async def delete(
        db: AsyncSession,
        item_db: ItemDB,
    ) -> bool:
        try:
            await db.delete(item_db)
            await db.commit()
            return True
        except Exception as e:
            await db.rollback()
            logger.info(e)
            return False
