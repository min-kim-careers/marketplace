from datetime import datetime
from typing import Optional
from uuid import UUID
from app.cache.helpers import process_redis
from app.cache import redis
from app.chat.repositories.chat_room import ChatRoomRepository
from sqlalchemy.ext.asyncio import AsyncSession


class ChatStatusManager:
    def __init__(self) -> None:
        pass

    def last_read_key(self, room_id: UUID, user_id: UUID) -> str:
        return f"chat:room:{str(room_id)}:user:{str(user_id)}:last_read"

    async def set_last_read(self, room_id: UUID, user_id: UUID, last_read: datetime):
        await redis.set(self.last_read_key(room_id, user_id), last_read.isoformat())

    async def get_last_read(self, room_id: UUID, user_id: UUID) -> Optional[datetime]:
        return datetime.fromisoformat(
            process_redis(await redis.get(self.last_read_key(room_id, user_id)))
        )

    async def update_last_read(self, db: AsyncSession, room_id: UUID, user_id: UUID):
        user_status = await ChatRoomRepository.status_by_user(db, user_id, room_id)
        if not user_status:
            raise Exception("no persisted user status")
        await self.set_last_read(room_id, user_id, user_status.last_read)

    def active_user_key(self, room_id: UUID):
        return f"chat:room:{str(room_id)}:members"

    async def user_is_active(self, room_id: UUID, user_id: UUID) -> bool:
        is_member = await redis.sismember(self.active_user_key(room_id), str(user_id))  # type: ignore
        return is_member == 1

    async def set_user_active(self, room_id: UUID, user_id: UUID):
        added = await redis.sadd(self.active_user_key(room_id), str(user_id))  # type: ignore
        if added != 1:
            raise Exception(f"user {str(user_id)} not active in room {str(room_id)}")

    async def set_user_inactive(self, room_id: UUID, user_id: UUID):
        removed = await redis.srem(self.active_user_key(room_id), str(user_id))  # type: ignore
        if removed != 1:
            raise Exception(f"user {str(user_id)} not active in room {str(room_id)}")


status_manager = ChatStatusManager()
