import inspect
from typing import Any, Optional
from app.cache import cache
from redis.typing import ResponseT

def process(rv: ResponseT) -> Any:
    assert not inspect.isawaitable(rv), "Expected non-awaitable"
    return rv

class CacheStore:
    def __init__(self, prefix: str, suffix: Optional[str] = None) -> None:
        self.prefix = prefix
        self.suffix = suffix
        self.cache = cache

    def to_key(self, id: Optional[str] = None):
        _suffix = ":" + self.suffix if self.suffix else ""
        return f"{self.prefix}:{id}" + _suffix if id else self.prefix + _suffix

    def get(self, id: Optional[str] = None):
        return process(self.cache.get(self.to_key(id)))

    def set(self, val: Any, id: Optional[str] = None):
        return process(self.cache.set(self.to_key(id), val))

    def exists(self, id: Optional[str] = None):
        return process(self.cache.exists(self.to_key(id)))

    def incr(self, id: Optional[str] = None):
        return process(self.cache.incr(self.to_key(id)))

    def decr(self, id: Optional[str] = None):
        return process(self.cache.decr(self.to_key(id)))
