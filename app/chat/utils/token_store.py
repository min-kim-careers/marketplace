from typing import Optional
from uuid import UUID

from app.cache import cache


class TokenStore:
    def __init__(self):
        self.key_prefix = "synapse:access_token:"
        self.cache = cache

    def make_key(self, user_id: UUID):
        return f"{self.key_prefix}:{str(user_id)}"

    def set_token(self, user_id: UUID, access_token: str):
        self.cache.set(self.make_key(user_id), access_token)

    def get_token(self, user_id: UUID) -> Optional[str]:
        token = self.cache.get(self.make_key(user_id))
        if token:
            return str(token)


token_store = TokenStore()
