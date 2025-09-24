from uuid import UUID
from app.cache.cache import redis


class UserActiveRoom:
    def _user_active_room_key(self, room_id: UUID) -> str:
        return f"chat:room:{str(room_id)}:members"

    async def is_user_active_room(self, room_id: UUID, user_id: UUID) -> bool:
        is_member = await redis.sismember(self._user_active_room_key(room_id), str(user_id))  # type: ignore
        return is_member == 1

    async def set_user_active_room(self, room_id: UUID, user_id: UUID):
        added = await redis.sadd(self._user_active_room_key(room_id), str(user_id))  # type: ignore
        if added != 1:
            raise Exception(f"error setting user active")

    async def set_user_inactive_room(self, room_id: UUID, user_id: UUID):
        removed = await redis.srem(self._user_active_room_key(room_id), str(user_id))  # type: ignore
        if removed != 1:
            raise Exception(f"error setting user inactive")
