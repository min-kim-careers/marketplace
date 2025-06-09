from sqlmodel import select
from app.profile.model import ProfileDB
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from sqlalchemy.dialects.postgresql import insert



async def get_profile(session: AsyncSession, user_id: str) -> ProfileDB | None:
    result = await session.get(ProfileDB, user_id)
    return result


async def create_profile(
    session: AsyncSession, profile_db: ProfileDB
) -> ProfileDB | None:
    session.add(profile_db)
    try:
        await session.commit()
    except IntegrityError:
        await session.rollback()
        return None
    await session.refresh(profile_db)
    return profile_db


async def update_profile(
    session: AsyncSession, profile_db: ProfileDB
) -> ProfileDB | None:
    existing = await get_profile(session, str(profile_db.user_id))
    if not existing:
        return None

    for field, value in profile_db.model_dump().items():
        setattr(existing, field, value)

    await session.commit()
    await session.refresh(existing)
    return existing

# async def upsert_profile(
#     session: AsyncSession, profile_db: ProfileDB
# ) -> ProfileDB | None:
#     try:
#         stmt = insert(ProfileDB).values(**profile_db.model_dump())
#         stmt = stmt.on_conflict_do_update(
#             index_elements=['']
#         )