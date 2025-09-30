from app.auth.firebase.schemas.outbound import FirebaseUser
from app.auth.user.repository import UserRepository
from app.core.schemas.error import ErrorResponse
from app.db.models.user import UserDB
from app.db.session import get_db
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.auth.firebase.schemas.outbound import FirebaseUser
from app.auth.helpers import get_session_from_request_optional
from app.core.logger import logger
from app.core.schemas.error import ErrorResponse
from fastapi import Depends, status
from firebase_admin import auth
from firebase_admin.exceptions import FirebaseError


async def get_firebase_user_from_session_optional(
    session: str | None = Depends(get_session_from_request_optional),
) -> FirebaseUser | None:
    if not session:
        return

    try:
        token_data = auth.verify_session_cookie(session, check_revoked=True)

        decoded_token = FirebaseUser(
            uid=token_data["uid"],
            email=token_data["email"],
            picture=token_data["picture"],
        )

        # logger.info(f"UID: {decoded_token.uid} verified, Email: {decoded_token.email}")

        return decoded_token
    except FirebaseError as e:
        logger.info(f"Session cookie verification failed: {e}")
        raise ErrorResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            message=f"Invalid or expired session: {e}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        logger.info(f"Unexpected error during session verification: {e}")
        raise ErrorResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error during authentication.",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def resolve_firebase_session_optional(
    firebase_user: FirebaseUser | None = Depends(
        get_firebase_user_from_session_optional
    ),
    db: AsyncSession = Depends(get_db),
) -> UserDB | None:
    if not firebase_user:
        return None
    user = await UserRepository.get_user_by_provider(db, firebase_user.uid)
    if not user:
        raise ErrorResponse(status_code=404, message="Invalid user")

    return user
