from datetime import timedelta

from fastapi import APIRouter, Body, Cookie, Depends, HTTPException, Query, status
from firebase_admin import auth
from rich import print
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.firebase.dependencies import (
    get_firebase_user_from_session,
    get_firebase_user_from_token,
    resolve_firebase_session,
    resolve_firebase_token,
)
from app.auth.firebase.service import FirebaseService
from app.core.schemas.error import ErrorResponse
from app.db.session import get_db
from app.db.models.user import UserDB
from app.auth.user.repository import UserRepository
from app.auth.user.schemas.inbound import UserInDB
from app.auth.firebase.schemas.outbound import FirebaseResponse, FirebaseUser
from app.profile.schemas.outbound import ProfileOut

firebase_router = APIRouter(prefix="/auth/firebase", tags=['Auth - Firebase'])


@firebase_router.post("/session")
async def get_session(
    id_token: str = Body(..., embed=True, alias="idToken"),
    firebase_user: FirebaseUser = Depends(get_firebase_user_from_token),
    db: AsyncSession = Depends(get_db),
) -> FirebaseResponse:
    user = await UserRepository.get_user_by_provider_id(db, firebase_user.uid)
    if not user:
        user = await FirebaseService.handle_new_user(db, firebase_user)

    expires_in_seconds = int(timedelta(days=5).total_seconds())
    session_cookie = auth.create_session_cookie(id_token, expires_in=expires_in_seconds)

    return FirebaseResponse(
        data={
            "profile": ProfileOut.model_validate(user.profile, from_attributes=True),
            "session": {
                "value": session_cookie,
                "expiry": expires_in_seconds,
            },
        },
    )


@firebase_router.post("/session/verify")
async def verify_session(
    _=Depends(resolve_firebase_session),
) -> FirebaseResponse:
    return FirebaseResponse(message="Session verified")


@firebase_router.post("/session/revoke")
async def revoke_session(
    firebase_user: FirebaseUser = Depends(get_firebase_user_from_session),
) -> FirebaseResponse:
    try:
        auth.revoke_refresh_tokens(firebase_user.uid)
    except Exception as e:
        raise ErrorResponse(status_code=404, message=str(e))

    return FirebaseResponse(message="Session revoked")


@firebase_router.post("/token/verify")
async def verify_token(
    _=Depends(resolve_firebase_token),
) -> FirebaseResponse:
    return FirebaseResponse(message="Token verified")
