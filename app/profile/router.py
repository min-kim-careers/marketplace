from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.database import get_session
from app.common.schemas.error import ErrorResponse
from app.profile import service
from app.profile.schemas.requests import UpsertProfileRequest
from app.profile.schemas.responses import (
    UpsertProfileResponse,
    GetProfileResponse,
    ProfileResponse,
)

profiles_router = APIRouter()


@profiles_router.get("/{user_id}", response_model=ProfileResponse)
async def get_profile(
    user_id: UUID,
    session: AsyncSession = Depends(get_session),
) -> ProfileResponse:
    profile = await service.get_profile(session, str(user_id))
    if not profile:
        raise ErrorResponse(status_code=404, message="Profile not found")

    data = GetProfileResponse(profile=profile)

    return ProfileResponse[GetProfileResponse](
        success=True,
        data=data,
    )


@profiles_router.post("/{user_id}", response_model=ProfileResponse)
async def upsert_profile(
    user_id: UUID,
    profile_in: UpsertProfileRequest,
    session: AsyncSession = Depends(get_session),
) -> ProfileResponse:

    profile = await service.upsert_profile(session, user_id, profile_in)
    if not profile:
        raise ErrorResponse(status_code=404, message="Profile upsert error")

    data = UpsertProfileResponse(profile=profile)

    return ProfileResponse[UpsertProfileResponse](
        success=True,
        data=data,
    )
