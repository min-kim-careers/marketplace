from sqlalchemy.ext.asyncio import AsyncSession

from app.item import repository
from app.item.schemas.common import ItemOut
from app.item.public.schemas.requests import GetItemsRequest
from app.item.public.schemas.responses import (
    GetItemsResponse,
)


async def get_paginated_items_with_count(
    session: AsyncSession, query: GetItemsRequest
) -> GetItemsResponse | None:
    items_db = await repository.get_items_paginated(session, query)
    if not items_db:
        return None

    count = await repository.get_items_count(session, query)

    items_out = [ItemOut.from_db(item) for item in items_db]

    return GetItemsResponse(
        items=items_out,
        count=count,
    )
