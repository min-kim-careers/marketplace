from typing import Optional
from uuid import UUID

from app.cache.stores.cache_store import CacheStore
from app.core.helpers import deep_get
from app.db.models.user import UserDB


class UnreadCountStore:
    def __init__(self):
        self.store = CacheStore("chat:unread:user")

    def unread_count(self, user: UserDB, sync_data: dict) -> int:
        unread_count = self.store.get(str(user.id))
        if unread_count:
            return int(unread_count) # type: ignore

        join_rooms: list[dict] = deep_get(sync_data, ["rooms", "join"], [])
        if not join_rooms:
            return 0

        message_count = read_count = 0
        for room in join_rooms:
            events: list[dict] = deep_get(room, ["timeline", "events"], [])
            for e in events:
                if e["sender"] != user.chat_user_id and e["type"] == "m.room.message":
                    message_count += 1

        unread_count = message_count - read_count
        self.store.set(unread_count, str(user.id))
        return unread_count


notification_store = UnreadCountStore()
