from typing import Optional

from app.cache.stores.cache_store import CacheStore
from app.core import env_loader


class AdminTokenStore:
    def __init__(self):
        self.store = CacheStore("chat:access_token:admin")
        self.admin_user = env_loader.SYNAPSE_ADMIN_USER

    def set_admin_token(self, access_token: str):
        return self.store.set(access_token)

    def get_admin_token(self) -> Optional[str]:
        return self.store.get()

admin_token_store = AdminTokenStore()
