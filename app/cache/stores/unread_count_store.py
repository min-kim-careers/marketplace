from typing import Literal, Optional
from uuid import UUID

from app.cache.stores.cache_store import CacheStore
from app.core.helpers import deep_get
from app.db.models.user import UserDB


class UnreadCountStore:
    def __init__(self):
        self.unread_store = CacheStore("chat:unread:user")
        self.unread_ready_store = CacheStore("chat:unread:user", "ready")

    def incr(self, user_id: str):
        return self.unread_store.incr(user_id)

    def decr(self, user_id: str):
        return self.unread_store.decr(user_id)

    def load_unread_count(
        self,
        user_id: str,
        chat_user_id: str,
        sync_data: dict,
    ) -> int:
        if self.unread_ready_store.get(user_id) == "1":
            return int(self.unread_store.get(user_id))

        join_rooms: list[dict] = deep_get(sync_data, ["rooms", "join"], {}).values()
        if not join_rooms:
            self.unread_ready_store.set("0", user_id)
            return 0

        message_count = read_count = 0
        for room in join_rooms:

            events: list[dict] = deep_get(room, ["timeline", "events"], [])
            for e in events:
                print(e["sender"], chat_user_id, e["type"])
                if e["sender"] != chat_user_id and e["type"] == "m.room.message":
                    message_count += 1

        unread_count = message_count - read_count
        self.unread_store.set(unread_count, user_id)
        self.unread_ready_store.set("1", user_id)
        return unread_count


unread_count_store = UnreadCountStore()
