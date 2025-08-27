from app.auth.firebase.dependencies import get_firebase_user_from_query_token
from app.auth.firebase.schemas.outbound import FirebaseUser
from app.auth.user.repository import UserRepository
from app.core.schemas.error import ErrorResponse
from app.db.models.user import UserDB
from app.db.session import get_db
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession


async def resolve_firebase_query_token(
    firebase_user: FirebaseUser = Depends(get_firebase_user_from_query_token),
    db: AsyncSession = Depends(get_db),
) -> UserDB:
    user = await UserRepository.get_user_by_provider(db, firebase_user.uid)
    if not user:
        raise ErrorResponse(status_code=404, message="Invalid user")

    return user
