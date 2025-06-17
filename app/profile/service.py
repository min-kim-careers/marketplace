from typing import List, Tuple
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.item.schemas.common import ItemOut, ItemListing
from app.item.schemas.requests import ItemsRequest
from app.profile import repository as profile_repository
from app.item import repository as item_repository
from app.profile.schemas.common import ProfileExtra, ProfileOut
from app.profile.schemas.requests import ProfileInRequest


async def get_profile(
    session: AsyncSession,
    user_id: UUID,
) -> ProfileOut | None:
    profile_db_out = await profile_repository.get_profile_by_user(session, user_id)
    if not profile_db_out:
        return None

    profile_out = ProfileOut.model_validate(profile_db_out.model_dump())

    return profile_out


async def upsert_profile(
    session: AsyncSession,
    user_id: UUID,
    profile_in: ProfileInRequest,
) -> ProfileOut | None:
    profile_db = await profile_repository.get_profile_by_user(session, user_id)
    if profile_db:
        profile_db = await profile_repository.update_profile(
            session, profile_db, profile_in
        )
    else:
        profile_db = await profile_repository.create_profile(
            session, user_id, profile_in
        )

    if not profile_db:
        return None

    profile_out = ProfileOut.model_validate(profile_db.model_dump())

    return profile_out


async def profile_handle_exists(session: AsyncSession, handle: str) -> bool:
    profile = await profile_repository.get_profile_by_handle(session, handle)

    exists = profile is not None

    return exists


async def get_profile_extra(
    session: AsyncSession,
    user_id: UUID,
) -> ProfileExtra | None:
    profile_db = await profile_repository.get_profile_by_user(session, user_id)
    if not profile_db:
        return None

    extra = ProfileExtra.model_validate(profile_db.extra)
    if not extra:
        return None

    return extra


async def get_user_items(
    session: AsyncSession,
    query: ItemsRequest,
    user_id: UUID,
) -> Tuple[List[ItemOut], int]:
    items_db = await item_repository.get_user_items(session, query, user_id)
    if not items_db:
        return [], 0

    count = await item_repository.get_user_items_count(session, query, user_id)

    items_out = [ItemOut.from_db(item) for item in items_db]

    return items_out, count
