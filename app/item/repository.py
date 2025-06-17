from typing import Any, List, Optional, Sequence, Tuple
from uuid import UUID

from sqlalchemy import Select, String, asc, cast, desc, func, or_, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.common.utils import get_one_by
from app.item.enums import ItemSortOrder
from app.item.model import ItemDB
from app.item.schemas.requests import (
    ItemsRequest,
    ItemCreateRequest,
    ItemUpdateRequest,
)
from app.profile.model import ProfileDB


def base_query(stmt: Select, query: ItemsRequest):
    if query.exclude_user:
        stmt = stmt.join(ItemDB.profile).where(ProfileDB.user_id != query.exclude_user)  # type: ignore

    if query.keyword:
        conditions = [
            func.lower(ItemDB.name).ilike(f"%{query.keyword}%"),
            func.lower(ItemDB.description).ilike(f"%{query.keyword}%"),
            func.lower(cast(ItemDB.category, String)).ilike(f"%{query.keyword}%"),
        ]
        stmt = stmt.where(or_(*conditions))
    return stmt


async def get_items(
    session: AsyncSession,
    query: ItemsRequest,
) -> Sequence[ItemDB]:
    try:
        stmt = select(ItemDB).options(selectinload(ItemDB.profile))  # type: ignore

        stmt = base_query(stmt, query)

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


async def get_items_count(session: AsyncSession, query: ItemsRequest) -> int:
    try:
        stmt = select(func.count()).select_from(ItemDB)  # type: ignore

        stmt = base_query(stmt, query)

        result = await session.execute(stmt)
        return result.scalar_one()
    except Exception as e:
        print(e)
        return 0


async def get_user_items(
    session: AsyncSession,
    query: ItemsRequest,
    user_id: UUID,
) -> Sequence[ItemDB]:
    try:
        stmt = select(ItemDB).options(selectinload(ItemDB.profile))  # type: ignore

        stmt = base_query(stmt, query)

        stmt = stmt.join(ItemDB.profile).where(ProfileDB.user_id == user_id)  # type: ignore

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


async def get_user_items_count(
    session: AsyncSession,
    query: ItemsRequest,
    user_id: UUID,
) -> int:
    try:
        stmt = select(func.count()).select_from(ItemDB)  # type: ignore

        stmt = base_query(stmt, query)

        stmt = stmt.join(ItemDB.profile).where(ProfileDB.user_id == user_id)  # type: ignore

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


async def delete_item(session: AsyncSession, item_db: ItemDB) -> bool:
    try:
        await session.delete(item_db)
        await session.commit()
        return True
    except Exception as e:
        await session.rollback()
        print(e)
        return False


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


async def update_image_urls(
    session: AsyncSession,
    item_db: ItemDB,
    image_urls: List[str],
) -> ItemDB | None:
    try:
        setattr(item_db, "image_urls", image_urls)
        await session.commit()
        await session.refresh(item_db)
        return item_db
    except Exception as e:
        await session.rollback()
        print(e)
        return None
