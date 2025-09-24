from uuid import UUID
from app.cache.helpers import process_redis
from app.cache.cache import redis
from app.chat.repositories.chat_message import ChatMessageRepository
from sqlalchemy.ext.asyncio import AsyncSession


class UnreadRoomExists:
    def _unread_room_exists_key(self, user_id: UUID) -> str:
        return f"chat:user:{str(user_id)}:unread_exists"

    async def unread_room_exists(self, db: AsyncSession, user_id: UUID) -> bool:
        key = self._unread_room_exists_key(user_id)
        if not await redis.exists(key):
            exists = await ChatMessageRepository.unread_exists(db, user_id)
            await self.set_unread_room_exists(user_id, exists)
            return exists
        exists = process_redis(await redis.get(key))
        return exists == 1

    async def set_unread_room_exists(self, user_id: UUID, exists: bool):
        await redis.set(
            self._unread_room_exists_key(user_id), 1 if exists else 0, ex=10
        )
