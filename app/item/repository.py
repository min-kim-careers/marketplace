from sqlmodel import func, select
from app.item.model import ItemDB
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, Sequence
from sqlalchemy.orm import selectinload

from app.item.schemas.requests import GetItemsRequest


async def get_items_paginated(
    session: AsyncSession, query: GetItemsRequest
) -> Sequence[ItemDB]:
    stmt = select(ItemDB).options(selectinload(ItemDB.profile))  # type: ignore
    if query.keyword:
        stmt = stmt.where(ItemDB.name.ilike(f"%{query.keyword}%"))  # type: ignore
    stmt = stmt.offset(query.offset).limit(query.limit)
    result = await session.execute(stmt)
    return result.scalars().all()


async def get_items_paginated_count(
    session: AsyncSession, query: GetItemsRequest
) -> int:
    stmt = select(func.count()).select_from(ItemDB)
    if query.keyword:
        stmt = stmt.where(ItemDB.name.ilike(f"%{query.keyword}%"))  # type: ignore
    result = await session.execute(stmt)
    return result.scalar_one()
