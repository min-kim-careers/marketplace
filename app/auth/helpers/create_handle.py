from app.auth.helpers.create_hash import create_hash
from app.core.logger import log_exception


@log_exception
def create_handle(base: str) -> str:
    hashed = create_hash(base)
    return "user" + hashed[:10]