from typing import List
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.common.utils import get_one_by
from app.item.model import ItemDB
from app.profile.model import ProfileDB
from app.profile.schemas.common import DEFAULT_IMAGE_LIMIT, ProfileExtra
from app.profile.schemas.requests import ProfileInRequest


async def get_profile_by_user(session: AsyncSession, user_id: UUID) -> ProfileDB | None:
    return await get_one_by(session, ProfileDB, user_id=user_id)


async def get_profile_by_handle(session: AsyncSession, handle: str) -> ProfileDB | None:
    return await get_one_by(session, ProfileDB, handle=handle)


async def create_profile(
    session: AsyncSession, user_id: UUID, profile_in: ProfileInRequest
) -> ProfileDB | None:
    try:
        profile_db = ProfileDB(
            user_id=user_id, **profile_in.model_dump(exclude_unset=True)
        )

        session.add(profile_db)
        await session.commit()
        await session.refresh(profile_db)
        return profile_db
    except Exception as e:
        await session.rollback()
        print(e)
        return None


async def update_profile(
    session: AsyncSession, profile_db: ProfileDB, profile_in: ProfileInRequest
) -> ProfileDB | None:
    try:
        for field, value in profile_in.model_dump(exclude_unset=True).items():
            setattr(profile_db, field, value)

        await session.commit()
        await session.refresh(profile_db)
        return profile_db
    except Exception as e:
        await session.rollback()
        print(e)
        return None


async def get_profile_items(
    session: AsyncSession,
    user_id: UUID,
) -> List[ItemDB]:
    try:
        stmt = select(ProfileDB).where(ProfileDB.user_id == user_id).options(selectinload(ProfileDB.items))  # type: ignore
        result = await session.execute(stmt)
        profile = result.scalar_one_or_none()
        if profile:
            return profile.items
        return []
    except Exception as e:
        print(e)
        return []
