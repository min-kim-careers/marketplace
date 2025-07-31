from uuid import UUID

from fastapi import APIRouter, Body, Depends, Path
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.schemas.error import ErrorResponse
from app.db.session import get_db
from app.profile.repositories.profile import ProfileRepository
from app.profile.schemas.inbound import ProfileIn
from app.profile.schemas.outbound import ProfileExtra, ProfileOut, ProfileResponse
from app.profile.service import ProfileService

profiles_router = APIRouter(prefix="/api/profiles")


@profiles_router.get("/user/{user_id}", response_model=ProfileResponse)
async def get_profile(
    user_id: UUID = Path(...),
    db: AsyncSession = Depends(get_db),
) -> ProfileResponse:
    profile_db = await ProfileRepository.get_by_user_id(db, user_id)
    if not profile_db:
        raise ErrorResponse(status_code=404, message="Profile not found")

    profile = ProfileOut.model_validate(profile_db, from_attributes=True)

    return ProfileResponse(
        data={
            "profile": profile,
        },
    )


@profiles_router.put("/user/{user_id}", response_model=ProfileResponse)
async def upsert_profile(
    user_id: UUID = Path(...),
    profile_in: ProfileIn = Body(...),
    db: AsyncSession = Depends(get_db),
) -> ProfileResponse:
    profile = await ProfileService.upsert_profile(db, user_id, profile_in)
    if not profile:
        raise ErrorResponse(status_code=404, message="Profile upsert error")

    return ProfileResponse(
        data={
            "profile": profile,
        },
    )


@profiles_router.get("/handle/{handle}", response_model=ProfileResponse)
async def exists_by_handle(
    handle: str = Path(...),
    db: AsyncSession = Depends(get_db),
) -> ProfileResponse:
    exists = await ProfileRepository.exists_by_handle(db, handle)

    return ProfileResponse(
        data={
            "exists": exists,
        },
    )


@profiles_router.get("/handle/{handle}/user-id", response_model=ProfileResponse)
async def get_user_id_by_handle(
    handle: str = Path(...),
    db: AsyncSession = Depends(get_db),
) -> ProfileResponse:
    profile_db = await ProfileRepository.get_by_handle(db, handle)
    if not profile_db:
        raise ErrorResponse(status_code=404, message="Profile not found")

    return ProfileResponse(
        data={
            "userId": profile_db.user_id,
        },
    )


@profiles_router.get("/user/{user_id}/extra", response_model=ProfileResponse)
async def get_profile_extra(
    user_id: UUID = Path(...),
    db: AsyncSession = Depends(get_db),
) -> ProfileResponse:
    extra = ProfileService.get_extra(db, user_id)
    if not extra:
        raise ErrorResponse(status_code=404, message="Profile extra not found")

    return ProfileResponse(
        data={
            "extra": extra,
        },
    )
