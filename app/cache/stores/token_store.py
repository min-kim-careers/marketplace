from typing import Optional

from app.cache.stores.cache_store import CacheStore


class TokenStore:
    def __init__(self):
        self.store = CacheStore("chat:access_token:user")

    def set_token(self, user_id: str, access_token: str):
        return self.store.set(access_token, user_id)

    def get_token(self, user_id: str) -> Optional[str]:
        return self.store.get(user_id)



token_store = TokenStore()
