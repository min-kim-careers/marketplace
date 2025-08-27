from app.auth.firebase.dependencies import get_firebase_user_from_session_optional
from app.auth.firebase.schemas.outbound import FirebaseUser
from app.auth.user.repository import UserRepository
from app.core.schemas.error import ErrorResponse
from app.db.models.user import UserDB
from app.db.session import get_db
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession


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
