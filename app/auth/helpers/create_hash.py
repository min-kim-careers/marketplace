from app.core.logger import log_exception


import hashlib


@log_exception
def create_hash(base: str) -> str:
    return hashlib.sha256(base.encode("utf‑8")).hexdigest()