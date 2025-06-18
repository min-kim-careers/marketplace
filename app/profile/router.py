from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_session
from app.common.schemas.error import ErrorResponse
from app.profile import service
from app.profile.schemas.common import ProfileExtra, ProfileOut
from app.profile.schemas.requests import ProfileInRequest
from app.profile.schemas.responses import ProfileResponse

profiles_router = APIRouter()


@profiles_router.get("/user/{user_id}", response_model=ProfileResponse)
async def get_profile(
    user_id: UUID,
    session: AsyncSession = Depends(get_session),
) -> ProfileResponse:
    profile_db = await service.get_profile_by_user_id(session, user_id)
    if not profile_db:
        raise ErrorResponse(status_code=404, message="Profile not found")

    profile = ProfileOut.model_validate(profile_db, from_attributes=True)

    return ProfileResponse(
        success=True,
        data={"profile": profile},
    )


@profiles_router.put("/user/{user_id}", response_model=ProfileResponse)
async def upsert_profile(
    user_id: UUID,
    profile_in: ProfileInRequest,
    session: AsyncSession = Depends(get_session),
) -> ProfileResponse:
    profile_db = await service.get_profile_by_user_id(session, user_id)
    if profile_db:
        profile_db = await service.update_profile(session, profile_db, profile_in)
    else:
        profile_db = await service.create_profile(session, user_id, profile_in)

    if not profile_db:
        raise ErrorResponse(status_code=404, message="Profile upsert error")

    profile = ProfileOut.model_validate(profile_db, from_attributes=True)

    return ProfileResponse(
        success=True,
        data={"profile": profile},
    )


@profiles_router.get("/exists/handle/{handle}", response_model=ProfileResponse)
async def check_handle_exists(
    handle: str,
    session: AsyncSession = Depends(get_session),
) -> ProfileResponse:
    profile = await service.get_profile_by_handle(session, handle)

    exists = profile is not None

    return ProfileResponse(
        success=True,
        data={"exists": exists},
    )


@profiles_router.get("/user/{user_id}/extra", response_model=ProfileResponse)
async def get_profile_extra(
    user_id: UUID,
    session: AsyncSession = Depends(get_session),
) -> ProfileResponse:
    profile_db = await service.get_profile_by_user_id(session, user_id)
    if not profile_db:
        raise ErrorResponse(status_code=404, message="Profile not found")

    extra = ProfileExtra.model_validate(profile_db.extra, from_attributes=True)
    if not extra:
        raise ErrorResponse(status_code=404, message="Profile extra not found")

    return ProfileResponse(
        success=True,
        data={"extra": extra},
    )
