from typing import List, Tuple

from sqlalchemy.ext.asyncio import AsyncSession

from app.item import repository
from app.item.public.schemas.requests import GetItemsRequest
from app.item.schemas.common import ItemOut


async def get_paginated_items_with_count(
    session: AsyncSession, query: GetItemsRequest
) -> Tuple[List[ItemOut], int] | None:
    items_db = await repository.get_items_paginated(session, query)
    if not items_db:
        return None

    count = await repository.get_items_count(session, query)

    items_out = [ItemOut.from_db(item) for item in items_db]

    return items_out, count
