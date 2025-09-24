from typing import Set
from uuid import UUID
from app.cache.helpers import process_redis
from app.cache.cache import redis


class UnreadRooms:
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
