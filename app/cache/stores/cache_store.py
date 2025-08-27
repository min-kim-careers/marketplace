import inspect
from abc import abstractmethod
from typing import Any

from redis import Redis
from redis.typing import ResponseT


def process(rv: ResponseT) -> Any:
    assert not inspect.isawaitable(rv), "Expected non-awaitable"
    return rv


class CacheStore(Redis):
    @abstractmethod
    def to_key(self, *args: str) -> str:
        pass

    def get(self, *args):
        return process(super().get(self.to_key(*args)))

    def set(self, val: Any, *args):
        return process(super().set(self.to_key(*args), val))

    def exists(self, *args):
        return process(super().exists(self.to_key(*args)))

    def incr(self, *args):
        return process(super().incr(self.to_key(*args)))

    def decr(self, *args):
        return process(super().decr(self.to_key(*args)))
