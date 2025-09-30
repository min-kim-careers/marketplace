from app.auth.firebase.schemas.outbound import FirebaseUser
from app.auth.user.repository import UserRepository
from app.core.schemas.error import ErrorResponse
from app.db.models.user import UserDB
from app.db.session import get_db
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.auth.firebase.schemas.outbound import FirebaseUser
from app.core.logger import logger
from app.core.schemas.error import ErrorResponse
from fastapi import Body, status
from firebase_admin import auth
from firebase_admin.exceptions import FirebaseError


async def get_firebase_user_from_body_token(
    id_token: str | None = Body(default=None, embed=True, alias="idToken"),
) -> FirebaseUser:
    if not id_token:
        raise ErrorResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            message="Not authenticated: No id token found.",
        )
    try:
        token_data = auth.verify_id_token(id_token, check_revoked=True)

        firebase_user = FirebaseUser(
            uid=token_data["uid"],
            email=token_data["email"],
            picture=token_data["picture"],
        )

        return firebase_user
    except FirebaseError as e:
        logger.info(f"Id token verification failed: {e}")
        raise ErrorResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            message=f"Invalid or expired id token: {e}",
        )
    except Exception as e:
        logger.info(f"Unexpected error during id token verification: {e}")
        raise ErrorResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error during authentication.",
        )


async def resolve_firebase_body_token(
    firebase_user: FirebaseUser = Depends(get_firebase_user_from_body_token),
    db: AsyncSession = Depends(get_db),
) -> UserDB:
    user = await UserRepository.get_user_by_provider(db, firebase_user.uid)
    if not user:
        raise ErrorResponse(status_code=404, message="Invalid user")

    return user
