from app.core.helpers import decode_alias


from fastapi import Path, Query


from uuid import UUID


def resolve_item_alias_path(
    item_alias: str = Path(alias="itemAlias"),
) -> UUID:
    return decode_alias(item_alias)
