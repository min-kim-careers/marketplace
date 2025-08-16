from app.core.utils import decode_slug


from fastapi import Path, Query


from uuid import UUID


def resolve_item_slug_path(
    item_slug: str = Path(alias="itemSlug"),
) -> UUID:
    return decode_slug(item_slug)
