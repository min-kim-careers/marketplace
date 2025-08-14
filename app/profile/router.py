from fastapi import APIRouter, Body, Depends, Path
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.firebase.dependencies import resolve_firebase_session
from app.core.schemas.error import ErrorResponse
from app.core.schemas.outbound import APIResponse
from app.core.security import verify_service_key
from app.db.models.user import UserDB
from app.db.session import get_db
from app.profile.dependencies import resolve_profile_in
from app.profile.repository import ProfileRepository
from app.profile.schemas.inbound import ProfileIn
from app.profile.schemas.outbound import ProfileExtraOut, ProfileOut
from app.profile.service import ProfileService

profiles_router = APIRouter(
    prefix="/api/profiles",
    tags=["Profiles"],
    dependencies=[Depends(verify_service_key)],
)


@profiles_router.get("", response_model=APIResponse)
async def get_profile(
    user: UserDB = Depends(resolve_firebase_session),
    db: AsyncSession = Depends(get_db),
) -> APIResponse:
    profile_db = await ProfileRepository.get_by_user_id(db, user.id)
    if not profile_db:
        raise ErrorResponse(status_code=404, message="Profile not found")

    profile = ProfileOut.model_validate(profile_db, from_attributes=True)

    return APIResponse(
        data={
            "profile": profile,
        },
    )


@profiles_router.put("", response_model=APIResponse)
async def upsert_profile(
    user: UserDB = Depends(resolve_profile_in),
    profile_in: ProfileIn = Body(...),
    db: AsyncSession = Depends(get_db),
) -> APIResponse:
    profile = await ProfileService.upsert_profile(db, user.profile, profile_in)

    return APIResponse(
        data={
            "profile": profile,
        },
    )


@profiles_router.get("/handle/{handle}", response_model=APIResponse)
async def exists_by_handle(
    _=Depends(resolve_firebase_session),
    handle: str = Path(...),
    db: AsyncSession = Depends(get_db),
) -> APIResponse:
    return APIResponse(
        data={
            "exists": await ProfileRepository.exists_by_handle(db, handle),
        },
    )


@profiles_router.get("/email/{email}", response_model=APIResponse)
async def exists_by_email(
    _=Depends(resolve_firebase_session),
    email: str = Path(...),
    db: AsyncSession = Depends(get_db),
) -> APIResponse:
    return APIResponse(
        data={
            "exists": await ProfileRepository.exists_by_email(db, email),
        },
    )


@profiles_router.get("/extra", response_model=APIResponse)
async def get_profile_extra(
    user: UserDB = Depends(resolve_firebase_session),
) -> APIResponse:
    extra = ProfileExtraOut.from_db(user.profile.extra)
    if not extra:
        raise ErrorResponse(status_code=404, message="Profile extra not found")

    return APIResponse(
        data={
            "extra": extra,
        },
    )
