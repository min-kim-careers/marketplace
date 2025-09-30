import hashlib

from app.core.logger import log_exception


@log_exception
def create_hash(base: str) -> str:
    return hashlib.sha256(base.encode("utf‑8")).hexdigest()


@log_exception
def create_handle(base: str) -> str:
    hashed = create_hash(base)
    return "user" + hashed[:10]
