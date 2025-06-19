from typing import List
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.common import utils
from app.db.models.item import ItemDB
from app.db.models.profile import ProfileDB
from app.profile.schemas.common import DEFAULT_IMAGE_LIMIT, ProfileExtra
from app.profile.schemas.requests import ProfileInRequest


async def get_profile_by_user_id(session: AsyncSession, user_id: UUID) -> ProfileDB | None:
    return await utils.get_one_by(session, ProfileDB, user_id=user_id)


async def get_profile_by_handle(session: AsyncSession, handle: str) -> ProfileDB | None:
    return await utils.get_one_by(session, ProfileDB, handle=handle)


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
