from datetime import timedelta
from typing import Annotated

from app.auth.firebase.dependencies import (
    get_firebase_user_from_request,
    get_firebase_user_from_session,
    resolve_firebase_body_token,
    resolve_firebase_session,
)
from app.auth.firebase.schemas.inbound import GetSessionRequest
from app.auth.firebase.schemas.outbound import FirebaseUser
from app.auth.firebase.service import FirebaseService
from app.auth.helpers.verify_nonce import verify_nonce
from app.auth.user.repository import UserRepository
from app.core.schemas.error import ErrorResponse
from app.core.schemas.outbound import APIResponse
from app.db.session import get_db
from app.profile.schemas.outbound import ProfileOut
from fastapi import APIRouter, Body, Depends, Request
from firebase_admin import auth
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import NoResultFound

firebase_router = APIRouter(prefix="/auth/firebase", tags=["Auth - Firebase"])


@firebase_router.post("/session")
async def get_session(
    request: GetSessionRequest,
    firebase_user: FirebaseUser = Depends(get_firebase_user_from_request),
    db: AsyncSession = Depends(get_db),
):
    if request.nonce:
        verified = verify_nonce(request.nonce)
        if not verified and request.is_new_user:
            auth.delete_user(firebase_user.uid)
            raise ErrorResponse(status_code=403, message="Nonce expired")

    try:
        user = await UserRepository.get_user_by_provider(db, firebase_user.uid)
    except NoResultFound:
        user = await FirebaseService.handle_new_user(db, firebase_user)

    expires_in_seconds = int(timedelta(days=5).total_seconds())
    session_cookie = auth.create_session_cookie(
        request.id_token, expires_in=expires_in_seconds
    )

    return APIResponse(
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
):
    return APIResponse(message="Session verified")


@firebase_router.post("/session/revoke")
async def revoke_session(
    firebase_user: FirebaseUser = Depends(get_firebase_user_from_session),
):
    auth.revoke_refresh_tokens(firebase_user.uid)
    return APIResponse(message="Session revoked")


@firebase_router.post("/token/verify")
async def verify_token(
    _=Depends(resolve_firebase_body_token),
):
    return APIResponse(message="Token verified")
