from uuid import UUID
from sqlmodel import select
from app.profile.model import ProfileDB
from sqlalchemy.ext.asyncio import AsyncSession

from app.profile import repository
from app.profile.schemas.common import ProfileOut
from app.profile.schemas.requests import UpsertProfileRequest


async def get_profile(
    session: AsyncSession,
    user_id: str,
) -> ProfileOut | None:
    profile_db = await repository.get_profile(session, user_id)
    if not profile_db:
        return None

    profile_out = ProfileOut.model_validate(profile_db.model_dump())
    return profile_out


async def upsert_profile(
    session: AsyncSession,
    user_id: UUID,
    profile_in: UpsertProfileRequest,
) -> ProfileOut | None:
    profile_db_in = ProfileDB.model_validate(profile_in.model_dump())
    profile_db_in.user_id = user_id

    profile_db = await repository.update_profile(session, profile_db_in)
    if not profile_db:
        return None
    
    profile_db = await repository.create_profile(session, profile_db_in)
    if not profile_db:
        return None

    profile_out = ProfileOut.model_validate(profile_db.model_dump())

    return profile_out
