from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.database import get_session
from app.common.schemas.error import ErrorResponse
from app.crud.profile import create_profile, get_profile_by_id
from app.models.profile import Profile
from app.schemas.profile.requests import ProfileUpsertRequest
from app.schemas.profile.responses import ProfileResponse

profiles_router = APIRouter()


@profiles_router.get("/{profile_id}", response_model=ProfileResponse)
async def get_profile(
    profile_id: UUID, session: AsyncSession = Depends(get_session)
) -> ProfileResponse:
    profile = await get_profile_by_id(session, str(profile_id))
    if not profile:
        raise ErrorResponse(status_code=404, message="Profile not found")
    return ProfileResponse[Profile](
        success=True,
        data=profile,
    )


@profiles_router.put("", response_model=ProfileResponse)
async def create(
    profile_in: ProfileUpsertRequest, session: AsyncSession = Depends(get_session)
) -> ProfileResponse:
    profile = Profile(**profile_in.model_dump())
    data = await create_profile(session, profile)
    if not data:
        raise ErrorResponse(status_code=404, message="Profile upsert error")
    return ProfileResponse[Profile](
        success=True,
        data=data,
    )
