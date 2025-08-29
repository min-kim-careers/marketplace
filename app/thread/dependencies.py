from uuid import UUID

from app.core.helpers import decode_uuid
from fastapi import Path


def resolve_thread_id(thread_alias: str = Path(..., alias="threadAlias")) -> UUID:
    return decode_uuid(thread_alias)
