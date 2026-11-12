from uuid import UUID
from app.cache.cache import redis


class UserActive:
    def _user_active_key(self) -> str:
        return f"chat:user:members"

    async def is_user_active(self, user_id: UUID) -> bool:
        is_member = await redis.sismember(self._user_active_key(), str(user_id))  # type: ignore
        return is_member == 1

    async def set_user_active(self, user_id: UUID):
        added = await redis.sadd(self._user_active_key(), str(user_id))  # type: ignore
        if added != 1:
            raise Exception(f"error setting user active")

    async def set_user_inactive(self, user_id: UUID):
        removed = await redis.srem(self._user_active_key(), str(user_id))  # type: ignore
        if removed != 1:
            raise Exception(f"error setting user inactive")
