from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.config.session import get_db
from app.common.schemas.error import ErrorResponse
from app.db.repositories.profile import ProfileRepository
from app.profile.schemas.outbound import ProfileExtra
from app.profile.schemas.inbound import ProfileIn
from app.profile.schemas.outbound import ProfileOut, ProfileResponse

profiles_router = APIRouter()


@profiles_router.get("/user/{user_id}", response_model=ProfileResponse)
async def get_profile(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> ProfileResponse:
    profile_db = await ProfileRepository.get_profile_by_user_id(db, user_id)
    if not profile_db:
        raise ErrorResponse(status_code=404, message="Profile not found")

    profile = ProfileOut.model_validate(profile_db, from_attributes=True)

    return ProfileResponse(
        data={"profile": profile},
    )


@profiles_router.put("/user/{user_id}", response_model=ProfileResponse)
async def upsert_profile(
    user_id: UUID,
    profile_in: ProfileIn,
    db: AsyncSession = Depends(get_db),
) -> ProfileResponse:
    profile_db = await ProfileRepository.get_profile_by_user_id(db, user_id)
    if profile_db:
        profile_db = await ProfileRepository.update_profile(
            db, profile_db, profile_in
        )
    else:
        profile_db = await ProfileRepository.create_profile(
            db, user_id, profile_in
        )

    if not profile_db:
        raise ErrorResponse(status_code=404, message="Profile upsert error")

    profile = ProfileOut.model_validate(profile_db, from_attributes=True)

    return ProfileResponse(
        data={"profile": profile},
    )


@profiles_router.get("/exists/handle/{handle}", response_model=ProfileResponse)
async def check_handle_exists(
    handle: str,
    db: AsyncSession = Depends(get_db),
) -> ProfileResponse:
    profile = await ProfileRepository.get_profile_by_handle(db, handle)

    exists = profile is not None

    return ProfileResponse(
        message="Handle already exists",
        data={"exists": exists},
    )


@profiles_router.get("/user/{user_id}/extra", response_model=ProfileResponse)
async def get_profile_extra(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> ProfileResponse:
    profile_db = await ProfileRepository.get_profile_by_user_id(db, user_id)
    if not profile_db:
        raise ErrorResponse(status_code=404, message="Profile not found")

    extra = ProfileExtra.model_validate(profile_db.extra, from_attributes=True)
    if not extra:
        raise ErrorResponse(status_code=404, message="Profile extra not found")

    return ProfileResponse(
        data={"extra": extra},
    )
