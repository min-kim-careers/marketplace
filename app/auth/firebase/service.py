from app.auth.firebase.helpers import create_handle
from app.auth.firebase.schemas.outbound import FirebaseUser
from app.auth.user.repository import UserRepository
from app.auth.user.schemas.inbound import UserInDB
from firebase_admin import auth
from sqlalchemy.ext.asyncio import AsyncSession

from app.chat.service import ChatService
from app.core.schemas.error import ErrorResponse
from app.profile.repository import ProfileRepository
from app.profile.schemas.inbound import ProfileInCreateDB


class FirebaseService:
    @staticmethod
    async def handle_new_user(db: AsyncSession, firebase_user: FirebaseUser):
        new_user = await UserRepository.create_user_with_profile(
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

        if not new_user:
            auth.delete_user(firebase_user.uid)
            raise ErrorResponse(
                status_code=500, message="Error creating new user with profile"
            )

        chat_user = await ChatService.register_new_user(
            new_user.id,
        )

        if not chat_user:
            auth.delete_user(firebase_user.uid)
            raise ErrorResponse(status_code=500, message="Error creating chat user")

        return new_user
