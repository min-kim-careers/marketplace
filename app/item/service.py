from app.common.schemas.error import ErrorResponse
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Tuple

from app.item.repository import get_items_paginated
from app.item.schemas.common import ItemOut
from app.item.schemas.requests import GetItemsRequest
from app.item.repository import get_items_paginated_count


async def get_paginated_items_with_count(
    session: AsyncSession, query: GetItemsRequest
) -> dict | None:
    items_db = await get_items_paginated(session, query)
    if not items_db:
        return None

    items_out = [ItemOut.from_db(item) for item in items_db]

    count = await get_items_paginated_count(session, query)

    return dict(
        items=items_out,
        count=count,
    )
