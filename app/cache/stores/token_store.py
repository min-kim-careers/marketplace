from typing import Optional

from app.cache.stores.cache_store import CacheStore


class TokenStore(CacheStore):
    def to_key(self, user_id):
        return f"chat:user:{user_id}:access_token"

    def set(self, user_id: str, access_token: str):
        return super().set(access_token, user_id)

    def get(self, user_id: str) -> Optional[str]:
        return super().get(user_id)
