from typing import Any, List, Optional, Sequence, Tuple
from uuid import UUID

from sqlalchemy import Select, String, and_, asc, cast, desc, func, or_, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.utils import get_one_by
from app.item.schemas.inbound import ItemInDB
from app.item.enums import ItemSortOrder, ItemStatus
from app.item.models.item import ItemDB
from app.item.schemas.inbound import (
    ItemsQuery,
)


class ItemRepository:
    @staticmethod
    def build_base_query(stmt: Select, query: ItemsQuery):
        if query.keyword:
            or_conditions = [
                func.lower(ItemDB.name).ilike(f"%{query.keyword}%"),
                func.lower(ItemDB.description).ilike(f"%{query.keyword}%"),
                func.lower(cast(ItemDB.category, String)).ilike(f"%{query.keyword}%"),
            ]
            stmt = stmt.where(
                or_(*or_conditions),
            )
        return stmt

    @staticmethod
    async def get_all_paginated(
        db: AsyncSession,
        query: ItemsQuery,
    ) -> Sequence[ItemDB] | None:
        try:
            stmt = (
                select(ItemDB)
                .options(selectinload(ItemDB.profile))
                .where(
                    ItemDB.status.in_(
                        [
                            ItemStatus.available,
                            ItemStatus.pending,
                        ]
                    )
                )
            )

            if query.exclude_user:
                stmt = stmt.where(ItemDB.user_id != query.exclude_user)

            stmt = ItemRepository.build_base_query(stmt, query)

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
            print(e)
            return None

    @staticmethod
    async def get_all_count_paginated(db: AsyncSession, query: ItemsQuery) -> int:
        try:
            stmt = (
                select(func.count())
                .select_from(ItemDB)
                .where(
                    ItemDB.status.in_(
                        [
                            ItemStatus.available,
                            ItemStatus.pending,
                        ]
                    )
                )
            )

            if query.exclude_user:
                stmt = stmt.where(ItemDB.user_id != query.exclude_user)

            stmt = ItemRepository.build_base_query(stmt, query)

            result = await db.execute(stmt)
            return result.scalar_one()
        except Exception as e:
            print(e)
            return 0

    @staticmethod
    async def get_all_by_user_id_paginated(
        db: AsyncSession,
        user_id: UUID,
        query: ItemsQuery,
    ) -> Sequence[ItemDB] | None:
        try:
            stmt = (
                select(ItemDB)
                .options(selectinload(ItemDB.profile))
                .where(ItemDB.user_id == user_id)
            )

            stmt = ItemRepository.build_base_query(stmt, query)

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
            print(e)
            return None

    @staticmethod
    async def get_all_count_by_user_id_paginated(
        db: AsyncSession,
        user_id: UUID,
        query: ItemsQuery,
    ) -> int:
        try:
            stmt = (
                select(func.count())
                .select_from(ItemDB)
                .where(ItemDB.user_id == user_id)
            )

            stmt = ItemRepository.build_base_query(stmt, query)

            result = await db.execute(stmt)
            return result.scalar_one()
        except Exception as e:
            print(e)
            return 0

    @staticmethod
    async def get_all_count_by_user_id(
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
            print(e)
            return 0

    @staticmethod
    async def get_by_item_and_user_id(
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
    async def get_by_items_and_user_id(
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
            print(e)
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
            print(e)
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
            print(e)
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
            print(e)
            return False
