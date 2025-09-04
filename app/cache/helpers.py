import inspect
from typing import Any
from redis.typing import ResponseT


def process_redis(rv: ResponseT) -> Any:
    assert not inspect.isawaitable(rv), "Expected non-awaitable"
    return rv
