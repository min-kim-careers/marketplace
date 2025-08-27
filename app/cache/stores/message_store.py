from app.cache.stores.cache_store import CacheStore


class MessageStore(CacheStore):
    def to_key(self, room_id: str, user_id: str):
        return f"chat:room:{room_id}:user:{user_id}:messages"
