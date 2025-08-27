from uuid import UUID

from app.core.helpers import decode_uuid
from fastapi import Path


def resolve_item_alias_path(
    item_alias: str = Path(alias="itemAlias"),
) -> UUID:
    return decode_uuid(item_alias)
