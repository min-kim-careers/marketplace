from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.database import get_session
from app.common.schemas.error import ErrorResponse
from app.profile import service
from app.profile.schemas.requests import ProfileIn
from app.profile.schemas.responses import (
    CheckHandleExistsResponse,
    UpsertProfileResponse,
    GetProfileResponse,
    ProfileResponse,
)
from rich import print

profiles_router = APIRouter()


@profiles_router.get("/{user_id}", response_model=ProfileResponse[GetProfileResponse])
async def get_profile(
    user_id: UUID,
    session: AsyncSession = Depends(get_session),
) -> ProfileResponse[GetProfileResponse]:
    data = await service.get_profile(session, user_id)
    if not data:
        raise ErrorResponse(status_code=404, message="Profile not found")

    return ProfileResponse[GetProfileResponse](
        success=True,
        data=data,
    )


@profiles_router.put(
    "/{user_id}", response_model=ProfileResponse[UpsertProfileResponse]
)
async def upsert_profile(
    user_id: UUID,
    profile_in: ProfileIn,
    session: AsyncSession = Depends(get_session),
) -> ProfileResponse[UpsertProfileResponse]:
    data = await service.upsert_profile(session, user_id, profile_in)
    if not data:
        raise ErrorResponse(status_code=404, message="Profile upsert error")

    return ProfileResponse[UpsertProfileResponse](
        success=True,
        data=data,
    )


@profiles_router.get(
    "/exists/{handle}", response_model=ProfileResponse[CheckHandleExistsResponse]
)
async def check_handle_exists(
    handle: str, session: AsyncSession = Depends(get_session)
) -> ProfileResponse[CheckHandleExistsResponse]:
    data = await service.profile_handle_exists(session, handle)

    return ProfileResponse[CheckHandleExistsResponse](
        success=True,
        data=data,
    )
