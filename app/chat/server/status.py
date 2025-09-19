from datetime import datetime
from typing import Optional
from uuid import UUID
from app.cache.helpers import process_redis
from app.cache import redis
from app.chat.repositories.chat_room import ChatRoomRepository
from sqlalchemy.ext.asyncio import AsyncSession

from app.core import logger


class ChatStatusManager:
    def __init__(self) -> None:
        pass

    def last_read_key(self, room_id: UUID, user_id: UUID) -> str:
        return f"chat:room:{str(room_id)}:user:{str(user_id)}:last_read"

    async def set_last_read(self, room_id: UUID, user_id: UUID, last_read: datetime):
        await redis.set(self.last_read_key(room_id, user_id), last_read.isoformat())

    async def get_last_read(
        self, db: AsyncSession, room_id: UUID, user_id: UUID, from_db: bool = False
    ) -> Optional[datetime]:
        last_read = None
        try:
            if not from_db:
                last_read = process_redis(
                    await redis.get(self.last_read_key(room_id, user_id))
                )
                if last_read:
                    last_read = datetime.fromisoformat(last_read)

            if not last_read:
                user_status = await ChatRoomRepository.status_by_user(
                    db, user_id, room_id
                )
                if not user_status:
                    raise Exception("no persisted user status")
                last_read = user_status.last_read
                await self.set_last_read(room_id, user_id, last_read)
        except Exception as e:
            logger.error("failed to get last read from redis:", e)
        return last_read


status_manager = ChatStatusManager()
