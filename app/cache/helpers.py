import inspect
from typing import Any
from redis.typing import ResponseT

from app.core.logger import log_exception


@log_exception
def process_redis(rv: ResponseT) -> Any:
    assert not inspect.isawaitable(rv), "Expected non-awaitable"
    return rv
