from fastapi import Body, Depends, status
from firebase_admin import auth
from firebase_admin.exceptions import FirebaseError

from app.auth.helpers import get_session_from_request
from app.core.schemas.error import ErrorResponse
from app.core.db.session import get_db
from app.core.db.models.user import UserDB
from app.auth.user.repositories.user import UserRepository
from app.auth.firebase.schemas.outbound import FirebaseUser
from sqlalchemy.ext.asyncio import AsyncSession


async def get_firebase_user_from_session(
    session: str = Depends(get_session_from_request),
) -> FirebaseUser:
    try:
        token_data = auth.verify_session_cookie(session, check_revoked=True)

        decoded_token = FirebaseUser(
            uid=token_data["uid"],
            email=token_data["email"],
            picture=token_data["picture"],
        )

        # print(f"UID: {decoded_token.uid} verified, Email: {decoded_token.email}")

        return decoded_token
    except FirebaseError as e:
        print(f"Session cookie verification failed: {e}")
        raise ErrorResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            message=f"Invalid or expired session: {e}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        print(f"Unexpected error during session verification: {e}")
        raise ErrorResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error during authentication.",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_user_from_session(
    firebase_user: FirebaseUser = Depends(get_firebase_user_from_session),
    db: AsyncSession = Depends(get_db),
) -> UserDB | None:
    user = await UserRepository.get_user_by_provider_id(db, firebase_user.uid)
    return user


async def get_id_token_from_request(
    id_token: str | None = Body(default=None, embed=True, alias="idToken"),
) -> str:
    if not id_token:
        raise ErrorResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            message="Not authenticated: No id token found.",
        )
    return id_token


async def get_firebase_user_from_token(
    id_token: str = Depends(get_id_token_from_request),
) -> FirebaseUser:
    try:
        token_data = auth.verify_id_token(id_token, check_revoked=True)

        firebase_user = FirebaseUser(
            uid=token_data["uid"],
            email=token_data["email"],
            picture=token_data["picture"],
        )

        # print(f"UID: {firebase_user.uid} verified, Email: {firebase_user.email}")

        return firebase_user
    except FirebaseError as e:
        print(f"Id token verification failed: {e}")
        raise ErrorResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            message=f"Invalid or expired id token: {e}",
        )
    except Exception as e:
        print(f"Unexpected error during id token verification: {e}")
        raise ErrorResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error during authentication.",
        )


async def get_user_from_token(
    firebase_user: FirebaseUser = Depends(get_firebase_user_from_token),
    db: AsyncSession = Depends(get_db),
) -> UserDB | None:
    user = await UserRepository.get_user_by_provider_id(db, firebase_user.uid)
    return user
