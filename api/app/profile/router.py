from fastapi import APIRouter, Body, Depends, File, Path, UploadFile
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
from sqlalchemy.exc import NoResultFound

profiles_router = APIRouter(
    prefix="/api/profiles",
    tags=["Profiles"],
    dependencies=[Depends(verify_service_key)],
)


@profiles_router.get("")
async def get_profile(
    user: UserDB = Depends(resolve_firebase_session),
    db: AsyncSession = Depends(get_db),
) -> APIResponse:
    profile_db = await ProfileRepository.get_by_user_id(db, user.id)
    profile = ProfileOut.model_validate(profile_db, from_attributes=True)
    return APIResponse(
        data={
            "profile": profile,
        },
    )


@profiles_router.put("")
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


AVATAR_MAX_BYTES = 2 * 1024 * 1024


@profiles_router.put("/avatar")
async def upload_avatar(
    avatar: UploadFile = File(...),
    user: UserDB = Depends(resolve_firebase_session),
    db: AsyncSession = Depends(get_db),
) -> APIResponse:
    if not (avatar.content_type or "").startswith("image/"):
        raise ErrorResponse(status_code=400, message="Avatar must be an image")

    content = await avatar.read()
    if not content:
        raise ErrorResponse(status_code=400, message="Avatar file is empty")
    if len(content) > AVATAR_MAX_BYTES:
        raise ErrorResponse(status_code=400, message="Avatar exceeds 2MB")
    await avatar.seek(0)

    profile = await ProfileService.update_avatar(db, user.profile, avatar)
    return APIResponse(data={"profile": profile})


@profiles_router.delete("/avatar")
async def delete_avatar(
    user: UserDB = Depends(resolve_firebase_session),
    db: AsyncSession = Depends(get_db),
) -> APIResponse:
    profile = await ProfileService.remove_avatar(db, user.profile)
    return APIResponse(data={"profile": profile})


@profiles_router.get("/handle/{handle}")
async def exists_by_handle(
    _=Depends(resolve_firebase_session),
    handle: str = Path(alias="handle"),
    db: AsyncSession = Depends(get_db),
) -> APIResponse:
    exists = False
    try:
        exists = await ProfileRepository.exists_by_handle(db, handle)
    except NoResultFound:
        pass

    return APIResponse(
        data={
            "exists": exists,
        },
    )


@profiles_router.get("/email/{email}")
async def exists_by_email(
    _=Depends(resolve_firebase_session),
    email: str = Path(alias="email"),
    db: AsyncSession = Depends(get_db),
) -> APIResponse:
    exists = False
    try:
        exists = await ProfileRepository.exists_by_email(db, email)
    except NoResultFound:
        pass

    return APIResponse(
        data={
            "exists": exists,
        },
    )


@profiles_router.get("/extra")
async def get_profile_extra(
    user: UserDB = Depends(resolve_firebase_session),
) -> APIResponse:
    extra = ProfileExtraOut.from_db(user.profile.extra)
    return APIResponse(
        data={
            "extra": extra,
        },
    )
