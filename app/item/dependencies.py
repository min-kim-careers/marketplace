import base64
from uuid import UUID

from fastapi import Depends, Path

from app.common.schemas.error import ErrorResponse
from app.common.utils import slug_to_uuid
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.item import ItemDB
from app.db.session import get_session
from app.item import service


async def resolve_item(
    item_slug: str = Path(...),
    user_id: UUID = Path(...),
    session: AsyncSession = Depends(get_session),
) -> ItemDB:
    item_id = slug_to_uuid(item_slug)
    item_db = await service.get_item_by_id_and_user(session, user_id, item_id)
    if not item_db:
        raise ErrorResponse(status_code=404, message="Item not found")
    return item_db
