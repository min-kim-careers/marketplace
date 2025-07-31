from datetime import timedelta

from fastapi import APIRouter, Body, Cookie, Depends, HTTPException, Query, status
from firebase_admin import auth
from firebase_admin.exceptions import FirebaseError
from rich import print
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db.session import get_db
from app.core.db.models.user import UserDB
from app.auth.user.repositories.user import UserRepository
from app.auth.user.schemas.inbound import UserInDB
from app.auth.firebase.dependencies import (
    get_firebase_user_from_session,
    get_firebase_user_from_token,
    get_user_from_session,
    get_user_from_token,
)
from app.auth.firebase.schemas.outbound import FirebaseResponse, FirebaseUser

firebase_router = APIRouter(prefix="/auth/firebase")


@firebase_router.post("/get-session")
async def get_session(
    id_token: str = Body(..., embed=True, alias="idToken"),
    firebase_user: FirebaseUser = Depends(get_firebase_user_from_token),
    db: AsyncSession = Depends(get_db),
) -> FirebaseResponse:
    user = await UserRepository.get_user_by_provider_id(db, firebase_user.uid)
    if not user:
        user = await UserRepository.create_user(
            db,
            UserInDB(
                provider_name="firebase",
                provider_id=firebase_user.uid,
            ),
        )
        if not user:
            raise FirebaseError(code=500, message="Error creating new user")

    expires_in_seconds = int(timedelta(days=5).total_seconds())
    session_cookie = auth.create_session_cookie(id_token, expires_in=expires_in_seconds)

    return FirebaseResponse(
        data={
            "userId": user.id,
            "provider": {
                "firebase": firebase_user,
            },
            "session": {
                "value": session_cookie,
                "expiry": expires_in_seconds,
            },
        },
    )


@firebase_router.post("/verify-session")
async def verify_session(
    user: UserDB = Depends(get_user_from_session),
) -> FirebaseResponse:
    if not user:
        raise FirebaseError(code=404, message="User not found")

    return FirebaseResponse(
        data={
            "userId": user.id,
        },
    )


@firebase_router.post("/revoke-session")
async def revoke_session(
    firebase_user: FirebaseUser = Depends(get_firebase_user_from_session),
) -> FirebaseResponse:
    try:
        auth.revoke_refresh_tokens(firebase_user.uid)
    except Exception as e:
        raise FirebaseError(code=404, message=e)

    return FirebaseResponse(message="Session revoked")


@firebase_router.post("/verify-token")
async def verify_token(
    user: UserDB = Depends(get_user_from_token),
) -> FirebaseResponse:
    if not user:
        raise FirebaseError(code=404, message="User not found")

    return FirebaseResponse(
        data={
            "userId": user.id,
        },
    )
