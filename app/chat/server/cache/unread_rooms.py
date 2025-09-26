from uuid import UUID
from app.cache.cache import redis
from app.core import logger


class UnreadRooms:
    def _unread_rooms_key(self, user_id: UUID) -> str:
        return f"chat:user:{str(user_id)}:unread_rooms"

    async def check_unread_rooms(self, user_id: UUID, room_ids: list[UUID]):
        rids = [str(rid) for rid in room_ids]
        res = await redis.smismember(self._unread_rooms_key(user_id), rids)  # type: ignore
        return {rid: bool(flag) for rid, flag in zip(room_ids, res)}

    async def has_unread(self, user_id: UUID) -> bool:
        unread_rooms_key = self._unread_rooms_key(user_id)
        unread_flags = await redis.smembers(unread_rooms_key)  # type: ignore
        return bool(unread_flags)

    async def add_unread_room(self, user_id: UUID, room_id: UUID):
        added = await redis.sadd(self._unread_rooms_key(user_id), str(room_id))  # type: ignore
        if added != 1:
            logger.info("unread room cached")

    async def remove_unread_room(self, user_id: UUID, room_id: UUID):
        removed = await redis.srem(self._unread_rooms_key(user_id), str(room_id))  # type: ignore
        if removed != 1:
            logger.info("unread room uncached")
