from app.auth.firebase.helpers import create_handle
from app.auth.firebase.schemas.outbound import FirebaseUser
from app.auth.user.repository import UserRepository
from app.auth.user.schemas.inbound import UserInDB
from app.core.logger import log_class_exceptions
from app.db.models.user import UserDB
from app.profile.schemas.inbound import ProfileInCreateDB
from sqlalchemy.ext.asyncio import AsyncSession


@log_class_exceptions
class FirebaseService:
    @staticmethod
    async def handle_new_user(db: AsyncSession, firebase_user: FirebaseUser) -> UserDB:
        return await UserRepository.create_user_with_profile(
            db,
            UserInDB(
                provider_name="firebase",
                provider_id=firebase_user.uid,
            ),
            ProfileInCreateDB(
                email=firebase_user.email,
                handle=create_handle(firebase_user.uid),
            ),
        )
