from datetime import datetime
from typing import Optional
from uuid import UUID
from app.cache.helpers import process_redis
from app.cache.cache import redis
from app.chat.repositories.chat_room import ChatRoomRepository
from sqlalchemy.ext.asyncio import AsyncSession


class LastRead:
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
