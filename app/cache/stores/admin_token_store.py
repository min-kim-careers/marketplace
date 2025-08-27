from typing import Optional

from app.cache.stores.cache_store import CacheStore
from app.core import env_loader


class AdminTokenStore(CacheStore):
    def __init__(self):
        self.user_id = env_loader.SYNAPSE_ADMIN_USER

    def to_key(self):
        return "chat:access_token:admin"

    def set(self, access_token: str):
        return super().set(access_token)

    def get(self) -> Optional[str]:
        return super().get()
