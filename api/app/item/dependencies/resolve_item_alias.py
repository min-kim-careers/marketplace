from uuid import UUID

from app.core.helpers import decode_uuid
from fastapi import Query


def resolve_item_alias_query(
    item_alias: str = Query(None, alias="itemAlias"),
) -> UUID | None:
    if not item_alias:
        return None
    return decode_uuid(item_alias)
