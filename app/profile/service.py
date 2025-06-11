from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.item.schemas.common import ItemOut
from app.profile import repository
from app.profile.schemas.common import ProfileOut
from app.profile.schemas.requests import ProfileIn
from app.profile.schemas.responses import (
    CheckHandleExistsResponse,
    GetProfileResponse,
    GetUserItemsResponse,
    UpsertProfileResponse,
)


async def get_profile(
    session: AsyncSession,
    user_id: UUID,
) -> GetProfileResponse | None:
    profile_db_out = await repository.get_profile_by_user(session, user_id)
    if not profile_db_out:
        return None

    profile_out = ProfileOut.model_validate(profile_db_out.model_dump())

    return GetProfileResponse(profile=profile_out)


async def upsert_profile(
    session: AsyncSession,
    user_id: UUID,
    profile_in: ProfileIn,
) -> UpsertProfileResponse | None:
    profile_db = await repository.get_profile_by_user(session, user_id)
    if profile_db:
        profile_db = await repository.update_profile(session, profile_db, profile_in)
    else:
        profile_db = await repository.create_profile(session, user_id, profile_in)

    if not profile_db:
        return None

    profile_out = ProfileOut.model_validate(profile_db.model_dump())

    return UpsertProfileResponse(profile=profile_out)


async def profile_handle_exists(
    session: AsyncSession, handle: str
) -> CheckHandleExistsResponse | None:
    profile = await repository.get_profile_by_handle(session, handle)

    exists = profile is not None

    return CheckHandleExistsResponse(exists=exists)


async def get_user_items(
    session: AsyncSession,
    user_id: UUID,
) -> GetUserItemsResponse | None:
    items_db = await repository.get_user_items(session, user_id)
    if not items_db:
        return None

    items_out = [ItemOut.from_db(item) for item in items_db]

    return GetUserItemsResponse(items=items_out)
