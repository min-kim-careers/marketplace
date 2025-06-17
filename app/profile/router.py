from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_session
from app.common.schemas.error import ErrorResponse
from app.profile import service
from app.profile.schemas.requests import ProfileInRequest
from app.profile.schemas.responses import ProfileResponse

profiles_router = APIRouter()


@profiles_router.get("/{user_id}", response_model=ProfileResponse)
async def get_profile(
    user_id: UUID,
    session: AsyncSession = Depends(get_session),
) -> ProfileResponse:
    profile = await service.get_profile(session, user_id)
    if not profile:
        raise ErrorResponse(status_code=404, message="Profile not found")

    data = dict(
        profile=profile,
    )

    return ProfileResponse(
        success=True,
        data=data,
    )


@profiles_router.put("/{user_id}", response_model=ProfileResponse)
async def upsert_profile(
    user_id: UUID,
    profile_in: ProfileInRequest,
    session: AsyncSession = Depends(get_session),
) -> ProfileResponse:
    profile = await service.upsert_profile(session, user_id, profile_in)
    if not profile:
        raise ErrorResponse(status_code=404, message="Profile upsert error")

    data = dict(
        profile=profile,
    )

    return ProfileResponse(
        success=True,
        data=data,
    )


@profiles_router.get("/exists/{handle}", response_model=ProfileResponse)
async def check_handle_exists(
    handle: str,
    session: AsyncSession = Depends(get_session),
) -> ProfileResponse:
    exists = await service.profile_handle_exists(session, handle)

    data = dict(
        exists=exists,
    )

    return ProfileResponse(
        success=True,
        data=data,
    )


@profiles_router.get("/{user_id}/extra", response_model=ProfileResponse)
async def get_profile_extra(
    user_id: UUID,
    session: AsyncSession = Depends(get_session),
) -> ProfileResponse:
    extra = await service.get_profile_extra(session, user_id)

    data = dict(
        extra=extra,
    )

    return ProfileResponse(
        success=True,
        data=data,
    )


