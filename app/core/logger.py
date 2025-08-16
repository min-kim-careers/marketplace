import logging
import os
from typing import Optional


class PathFilter(logging.Filter):
    def __init__(self, allowed_prefix: str):
        super().__init__()
        self.allowed_prefix = os.path.abspath(allowed_prefix)

    def filter(self, record: logging.LogRecord) -> bool:
        record_path = os.path.abspath(record.pathname)
        return record_path.startswith(self.allowed_prefix)


class StripPrefixFormatter(logging.Formatter):
    def __init__(
        self,
        prefix_to_strip: str,
        fmt: Optional[str] = None,
        datefmt: Optional[str] = None,
    ):
        super().__init__(fmt, datefmt)
        self.prefix = os.path.abspath(prefix_to_strip)

    def format(self, record: logging.LogRecord) -> str:
        full_path = os.path.abspath(record.pathname)
        if full_path.startswith(self.prefix):
            record.pathname = full_path[len(self.prefix) :].lstrip(os.sep)
        else:
            record.pathname = full_path
        return super().format(record)


handler = logging.StreamHandler()
handler.addFilter(PathFilter(allowed_prefix="/code/app"))
fmt = "%(pathname)s:%(lineno)d - %(message)s"
handler.setFormatter(StripPrefixFormatter(prefix_to_strip="/code/app", fmt=fmt))

logging.basicConfig(
    level=logging.INFO,
    format="%(pathname)s:%(lineno)d - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    handlers=[handler],
)

logger = logging.getLogger(__name__)
