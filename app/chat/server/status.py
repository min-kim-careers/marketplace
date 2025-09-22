from datetime import datetime
from typing import Optional, Set
from uuid import UUID
from app.cache.helpers import process_redis
from app.cache.cache import redis
from app.chat.repositories.chat_message import ChatMessageRepository
from app.chat.repositories.chat_room import ChatRoomRepository
from sqlalchemy.ext.asyncio import AsyncSession


class ChatStatusManager:
    def __init__(self) -> None:
        pass

    # last read
    def _last_read_key(self, room_id: UUID, user_id: UUID) -> str:
        return f"chat:room:{str(room_id)}:user:{str(user_id)}:last_read"

    async def set_last_read(self, room_id: UUID, user_id: UUID, last_read: datetime):
        await redis.set(self._last_read_key(room_id, user_id), last_read.isoformat())

    async def get_last_read(self, room_id: UUID, user_id: UUID) -> Optional[datetime]:
        return datetime.fromisoformat(
            process_redis(await redis.get(self._last_read_key(room_id, user_id)))
        )

    async def update_last_read(self, db: AsyncSession, room_id: UUID, user_id: UUID):
        user_status = await ChatRoomRepository.status_by_user(db, user_id, room_id)
        if not user_status:
            raise Exception("no persisted user status")
        await self.set_last_read(room_id, user_id, user_status.last_read)

    # user active
    def _active_user_key(self, room_id: UUID) -> str:
        return f"chat:room:{str(room_id)}:members"

    async def user_is_active(self, room_id: UUID, user_id: UUID) -> bool:
        is_member = await redis.sismember(self._active_user_key(room_id), str(user_id))  # type: ignore
        return is_member == 1

    async def set_user_active(self, room_id: UUID, user_id: UUID):
        added = await redis.sadd(self._active_user_key(room_id), str(user_id))  # type: ignore
        if added != 1:
            raise Exception(f"error setting user active")

    async def set_user_inactive(self, room_id: UUID, user_id: UUID):
        removed = await redis.srem(self._active_user_key(room_id), str(user_id))  # type: ignore
        if removed != 1:
            raise Exception(f"error setting user inactive")

    # simple unread exists
    def _unread_exists_key(self, user_id: UUID) -> str:
        return f"chat:user:{str(user_id)}:unread_exists"

    async def unread_room_exists(self, db: AsyncSession, user_id: UUID) -> bool:
        key = self._unread_exists_key(user_id)
        if not await redis.exists(key):
            exists = await ChatMessageRepository.unread_exists(db, user_id)
            await self.set_unread_room_exists(user_id, exists)
            return exists
        exists = process_redis(await redis.get(key))
        return exists == 1

    async def set_unread_room_exists(self, user_id: UUID, exists: bool):
        await redis.set(self._unread_exists_key(user_id), 1 if exists else 0, ex=5)

    # unread room list
    def _unread_rooms_key(self, user_id: UUID) -> str:
        return f"chat:user:{str(user_id)}:unread_rooms"

    async def get_unread_rooms(self, user_id: UUID) -> Set[UUID]:
        return await process_redis(redis.smembers(self._unread_rooms_key(user_id)))

    async def add_unread_room(self, user_id: UUID, room_id: UUID):
        added = await redis.sadd(self._unread_rooms_key(user_id), str(room_id))  # type: ignore
        if added != 1:
            raise Exception(f"error adding unread room")

    async def remove_unread_room(self, user_id: UUID, room_id: UUID):
        removed = await redis.srem(self._unread_rooms_key(user_id), str(room_id))  # type: ignore
        if removed != 1:
            raise Exception(f"error removing unread room")


status_manager = ChatStatusManager()
