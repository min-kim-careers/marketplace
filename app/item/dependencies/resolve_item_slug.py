from app.core.utils import decode_slug


from fastapi import Query


from uuid import UUID


def resolve_item_slug_query(
    item_slug: str = Query(None, alias="itemSlug"),
) -> UUID | None:
    if not item_slug:
        return None
    return decode_slug(item_slug)