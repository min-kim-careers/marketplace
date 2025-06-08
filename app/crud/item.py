from sqlmodel import func, select
from app.models.item import Item
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

from app.schemas.item.requests import GetItemsRequest


async def get_items_paginated(
    session: AsyncSession, query: GetItemsRequest
) -> List[Item]:
    stmt = select(Item)
    if query.keyword:
        stmt = stmt.where(Item.name.ilike(f"%{query.keyword}%"))  # type: ignore
    stmt = stmt.offset(query.offset).limit(query.limit)
    result = await session.execute(stmt)
    return list(result.scalars().all())


async def get_items_count(
    session: AsyncSession, query: GetItemsRequest
) -> int:
    stmt = select(func.count()).select_from(Item)
    if query.keyword:
        stmt = stmt.where(Item.name.ilike(f"%{query.keyword}%"))  # type: ignore
    result = await session.execute(stmt)
    return result.scalar_one()


async def get_items_by_profile(session: AsyncSession, profile_id: str) -> List[Item]:
    result = await session.execute(select(Item).where(Item.profile_id == profile_id))
    return list(result.scalars().all())


async def get_item_by_id(session: AsyncSession, item_id: int) -> Item | None:
    result = await session.execute(select(Item).where(Item.id == item_id))
    return result.scalar_one_or_none()


async def upsert_item_db(session: AsyncSession, item: Item) -> Item:
    existing = await get_item_by_id(session, item.id)
    if existing:
        for field, value in item.model_dump().items():
            setattr(existing, field, value)
        await session.commit()
        await session.refresh(existing)
        return existing
    else:
        session.add(item)
        await session.commit()
        await session.refresh(item)
        return item
