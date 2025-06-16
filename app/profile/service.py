from typing import List
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.item.schemas.common import ItemOut, ItemListing
from app.profile import repository
from app.profile.schemas.common import ProfileExtra, ProfileOut
from app.profile.schemas.requests import ProfileInRequest


async def get_profile(
    session: AsyncSession,
    user_id: UUID,
) -> ProfileOut | None:
    profile_db_out = await repository.get_profile_by_user(session, user_id)
    if not profile_db_out:
        return None

    profile_out = ProfileOut.model_validate(profile_db_out.model_dump())

    return profile_out


async def upsert_profile(
    session: AsyncSession,
    user_id: UUID,
    profile_in: ProfileInRequest,
) -> ProfileOut | None:
    profile_db = await repository.get_profile_by_user(session, user_id)
    if profile_db:
        profile_db = await repository.update_profile(session, profile_db, profile_in)
    else:
        profile_db = await repository.create_profile(session, user_id, profile_in)

    if not profile_db:
        return None

    profile_out = ProfileOut.model_validate(profile_db.model_dump())

    return profile_out


async def profile_handle_exists(session: AsyncSession, handle: str) -> bool:
    profile = await repository.get_profile_by_handle(session, handle)

    exists = profile is not None

    return exists


async def get_profile_extra(
    session: AsyncSession,
    user_id: UUID,
) -> ProfileExtra | None:
    profile_db = await repository.get_profile_by_user(session, user_id)
    if not profile_db:
        return None

    extra = ProfileExtra.model_validate(profile_db.extra)
    if not extra:
        return None

    return extra


