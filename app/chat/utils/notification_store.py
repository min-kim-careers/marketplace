from typing import Optional
from uuid import UUID

from app.cache import cache


class NotificationStore:
    def __init__(self):
        self.unread_context = "chat:unread:user"
        self.cache = cache

    def preload(self, sync_data: dict):
        pass

    def to_key(self, user_id: UUID):
        return f"{self.unread_context}:{str(user_id)}"

    def set_unread(self, user_id: UUID, unread_count: int):
        self.cache.set(self.to_key(user_id), unread_count)

    def get_unread(self, user_id: UUID) -> Optional[int]:
        res = self.cache.get(self.to_key(user_id))
        if res:
            return int(res)  # pyright: ignore[reportArgumentType]

    def incr_unread(self, user_id: UUID) -> Optional[int]:
        res = self.cache.incr(self.to_key(user_id))
        if res:
            return int(res)  # pyright: ignore[reportArgumentType]

    def decr_unread(self, user_id: UUID) -> Optional[int]:
        res = self.cache.decr(self.to_key(user_id))
        if res:
            return int(res)  # pyright: ignore[reportArgumentType]


notification_store = NotificationStore()
