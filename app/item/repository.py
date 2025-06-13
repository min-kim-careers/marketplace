from typing import List, Optional, Sequence
from uuid import UUID

from sqlalchemy import String, asc, cast, desc, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.common.utils import get_one_by
from app.item.enums import ItemSortOrder
from app.item.model import ItemDB
from app.item.protected.schemas.requests import ItemCreateRequest, ItemUpdateRequest
from app.item.public.schemas.requests import GetItemsRequest


async def get_items_paginated(
    session: AsyncSession, query: GetItemsRequest
) -> Sequence[ItemDB]:
    try:
        stmt = select(ItemDB).options(selectinload(ItemDB.profile))  # type: ignore

        if query.keyword:
            conditions = [
                func.lower(ItemDB.name).ilike(f"%{query.keyword}%"),
                func.lower(ItemDB.description).ilike(f"%{query.keyword}%"),
                func.lower(cast(ItemDB.category, String)).ilike(f"%{query.keyword}%"),
            ]
            stmt = stmt.where(or_(*conditions))

        if query.sort_by:
            sort_column = getattr(ItemDB, query.sort_by.name)
            if query.sort_order == ItemSortOrder.asc:
                stmt = stmt.order_by(asc(sort_column))
            else:
                stmt = stmt.order_by(desc(sort_column))

        stmt = stmt.offset(query.offset).limit(query.limit)
        result = await session.execute(stmt)
        return result.scalars().all()
    except Exception as e:
        print(e)
        return []


async def get_items_count(
    session: AsyncSession, query: GetItemsRequest
) -> int:
    try:
        stmt = select(func.count()).select_from(ItemDB)

        if query.keyword:
            conditions = [
                func.lower(ItemDB.name).ilike(f"%{query.keyword}%"),
                func.lower(ItemDB.description).ilike(f"%{query.keyword}%"),
                func.lower(cast(ItemDB.category, String)).ilike(f"%{query.keyword}%"),
            ]
            stmt = stmt.where(or_(*conditions))

        result = await session.execute(stmt)
        return result.scalar_one()
    except Exception as e:
        print(e)
        return 0


async def get_item_by_id(session: AsyncSession, item_id: int) -> ItemDB | None:
    return await get_one_by(session, ItemDB, id=item_id)


async def create_item(
    session: AsyncSession, profile_id: UUID, item_in: ItemCreateRequest
) -> ItemDB | None:
    try:
        item_db = ItemDB(
            **item_in.model_dump(exclude_unset=True),
            profile_id=profile_id,
        )

        session.add(item_db)
        await session.commit()
        await session.refresh(item_db)
        return item_db
    except Exception as e:
        await session.rollback()
        print(e)
        return None


async def update_item(
    session: AsyncSession, item_db: ItemDB, item_in: ItemUpdateRequest
) -> ItemDB | None:
    try:
        for field, value in item_in.model_dump(exclude_unset=True).items():
            setattr(item_db, field, value)

        await session.commit()
        await session.refresh(item_db)
        return item_db
    except Exception as e:
        await session.rollback()
        print(e)
        return None