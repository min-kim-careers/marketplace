from typing import Any, List, Optional, Sequence, Tuple
from uuid import UUID

from sqlalchemy import Select, String, asc, cast, desc, func, or_, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.common.utils import get_one_by
from app.db.schemas.item import ItemInDB
from app.item.enums import ItemSortOrder
from app.db.models.item import ItemDB
from app.item.schemas.inbound import (
    ItemsQuery,
    ItemIn,
)

class ItemRepository:
    @staticmethod
    def base_query(stmt: Select, query: ItemsQuery):
        if query.keyword:
            conditions = [
                func.lower(ItemDB.name).ilike(f"%{query.keyword}%"),
                func.lower(ItemDB.description).ilike(f"%{query.keyword}%"),
                func.lower(cast(ItemDB.category, String)).ilike(f"%{query.keyword}%"),
            ]
            stmt = stmt.where(or_(*conditions))
        return stmt


    @staticmethod
    async def get_all_items(
        session: AsyncSession,
        query: ItemsQuery,
    ) -> Sequence[ItemDB] | None:
        try:
            stmt = select(ItemDB).options(selectinload(ItemDB.profile))

            if query.exclude_user:
                stmt = stmt.where(ItemDB.user_id != query.exclude_user)

            stmt = ItemRepository.base_query(stmt, query)

            if query.sort_by:
                sort_column = getattr(ItemDB, query.sort_by.value)
                if query.sort_order == ItemSortOrder.asc:
                    stmt = stmt.order_by(asc(sort_column))
                else:
                    stmt = stmt.order_by(desc(sort_column))

            stmt = stmt.offset(query.offset).limit(query.limit)
            result = await session.execute(stmt)
            return result.scalars().all()
        except Exception as e:
            print(e)
            return None


    @staticmethod
    async def get_all_items_count(session: AsyncSession, query: ItemsQuery) -> int:
        try:
            stmt = select(func.count()).select_from(ItemDB)

            if query.exclude_user:
                stmt = stmt.where(ItemDB.user_id != query.exclude_user)

            stmt = ItemRepository.base_query(stmt, query)

            result = await session.execute(stmt)
            return result.scalar_one()
        except Exception as e:
            print(e)
            return 0


    @staticmethod
    async def get_user_items(
        session: AsyncSession,
        user_id: UUID,
        query: ItemsQuery,
    ) -> Sequence[ItemDB] | None:
        try:
            stmt = (
                select(ItemDB)
                .options(selectinload(ItemDB.profile))
                .where(ItemDB.user_id == user_id)
            )

            stmt = ItemRepository.base_query(stmt, query)

            if query.sort_by:
                sort_column = getattr(ItemDB, query.sort_by.value)
                if query.sort_order == ItemSortOrder.asc:
                    stmt = stmt.order_by(asc(sort_column))
                else:
                    stmt = stmt.order_by(desc(sort_column))

            stmt = stmt.offset(query.offset).limit(query.limit)
            result = await session.execute(stmt)
            return result.scalars().all()
        except Exception as e:
            print(e)
            return None


    @staticmethod
    async def get_user_items_count(
        session: AsyncSession,
        user_id: UUID,
        query: ItemsQuery,
    ) -> int:
        try:
            stmt = select(func.count()).select_from(ItemDB).where(ItemDB.user_id == user_id)

            stmt = ItemRepository.base_query(stmt, query)

            result = await session.execute(stmt)
            return result.scalar_one()
        except Exception as e:
            print(e)
            return 0


    @staticmethod
    async def get_item_by_id_and_user(
        session: AsyncSession,
        user_id: UUID,
        item_id: UUID,
    ) -> ItemDB | None:
        return await get_one_by(
            session,
            ItemDB,
            user_id=user_id,
            id=item_id,
        )


    @staticmethod
    async def create_item(
        session: AsyncSession,
        user_id: UUID,
        item_in_db: ItemInDB,
    ) -> ItemDB | None:
        try:
            item_db = ItemDB(
                **item_in_db.model_dump(),
                user_id=user_id,
            )

            session.add(item_db)
            await session.commit()
            await session.refresh(item_db)
            return item_db
        except Exception as e:
            await session.rollback()
            print(e)
            return None


    @staticmethod
    async def update_item(
        session: AsyncSession,
        item_db: ItemDB,
        item_in_db: ItemInDB,
    ) -> ItemDB | None:
        try:
            for field, value in item_in_db.model_dump(exclude_unset=True).items():
                setattr(item_db, field, value)

            await session.commit()
            await session.refresh(item_db)
            return item_db
        except Exception as e:
            await session.rollback()
            print(e)
            return None


    @staticmethod
    async def delete_item(
        session: AsyncSession,
        item_db: ItemDB,
    ) -> bool:
        try:
            await session.delete(item_db)
            await session.commit()
            return True
        except Exception as e:
            await session.rollback()
            print(e)
            return False
