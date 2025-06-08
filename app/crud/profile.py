from sqlmodel import select
from app.models.profile import Profile
from sqlalchemy.ext.asyncio import AsyncSession

async def get_profile_by_id(session: AsyncSession, profile_id: str) -> Profile | None:
    result = await session.execute(select(Profile).where(Profile.id == profile_id))
    return result.scalar_one_or_none()

async def create_profile(session: AsyncSession, profile: Profile) -> Profile:
    session.add(profile)
    await session.commit()
    await session.refresh(profile)
    return profile
