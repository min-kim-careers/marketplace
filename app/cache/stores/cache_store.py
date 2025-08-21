from typing import Any, Optional
from app.cache import cache


class CacheStore:
    def __init__(self, prefix: str) -> None:
        self.prefix = prefix
        self.cache = cache

    def to_key(self, id: Optional[str] = None):
        return f"{self.prefix}:{id}" if id else self.prefix

    def get(self, id: Optional[str] = None):
        return self.cache.get(self.to_key(id))

    def set(self, val: Any, id: Optional[str] = None):
        return self.cache.set(self.to_key(id), val)

    def exists(self, id: Optional[str] = None):
        return self.cache.exists(self.to_key(id))

    def incr(self, id: Optional[str] = None):
        return self.cache.incr(self.to_key(id))

    def decr(self, id: Optional[str] = None):
        return self.cache.decr(self.to_key(id))
