from typing import Optional
from uuid import UUID

from app.cache import cache


class TokenStore:
    def __init__(self):
        self.cache = cache

    def set_token(self, user_id: UUID, access_token: str):
        self.cache.set(str(user_id), access_token)

    def get_token(self, user_id: UUID) -> Optional[str]:
        token = self.cache.get(str(user_id))
        if token:
            return str(token)


token_store = TokenStore()
