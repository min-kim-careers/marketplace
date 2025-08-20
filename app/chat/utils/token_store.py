from typing import Optional
from uuid import UUID

from app.cache import cache


class TokenStore:
    def __init__(self):
        self.context = "chat:access_token:user"
        self.cache = cache

    def to_key(self, user_id: UUID):
        return f"{self.context}:{str(user_id)}"

    def set_token(self, user_id: UUID, access_token: str):
        self.cache.set(self.to_key(user_id), access_token)

    def get_token(self, user_id: UUID) -> Optional[str]:
        token = self.cache.get(self.to_key(user_id))
        if token:
            return str(token)


token_store = TokenStore()
