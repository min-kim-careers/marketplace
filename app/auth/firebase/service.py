import uuid

from app.auth.firebase.helpers import create_handle
from app.auth.firebase.schemas.outbound import FirebaseUser
from app.auth.user.repository import UserRepository
from app.auth.user.schemas.inbound import UserInDB
from app.chat.service import ChatService
from app.core.schemas.error import ErrorResponse
from app.profile.schemas.inbound import ProfileInCreateDB
from sqlalchemy.ext.asyncio import AsyncSession


class FirebaseService:
    @staticmethod
    async def handle_new_user(db: AsyncSession, firebase_user: FirebaseUser):
        new_user_id = uuid.uuid4()

        chat_user = await ChatService.register_new_user(str(new_user_id))
        if not chat_user:
            raise ErrorResponse(status_code=500, message="Error creating chat user")

        new_user = await UserRepository.create_user_with_profile(
            db,
            UserInDB(
                id=new_user_id,
                provider_name="firebase",
                provider_id=firebase_user.uid,
                chat_user_id=chat_user.user_id,
            ),
            ProfileInCreateDB(
                email=firebase_user.email,
                handle=create_handle(firebase_user.uid),
            ),
        )

        if not new_user:
            # auth.delete_user(firebase_user.uid)

            if chat_user:
                await ChatService.delete_user(chat_user.user_id)

            raise ErrorResponse(
                status_code=500, message="Error creating new user with profile"
            )

        return new_user
