from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from app.item import repository
from app.item.protected.schemas.requests import ItemCreate, ItemUpdate
from app.item.protected.schemas.responses import (
    CreateItemResponse,
    UpdateItemResponse,
)
from app.item.schemas.common import ItemOut
from app.profile.repository import get_profile_by_user


async def create_item(
    session: AsyncSession,
    user_id: UUID,
    item_in: ItemCreate,
) -> CreateItemResponse | None:
    profile_db = await get_profile_by_user(session, user_id)
    if not profile_db:
        print("No profile found")
        return None

    item_db = await repository.create_item(session, profile_db.id, item_in)
    if not item_db:
        return None

    item_out = ItemOut.from_db(item_db)

    return CreateItemResponse(item=item_out)


async def update_item(
    session: AsyncSession,
    item_id: int,
    item_in: ItemUpdate,
) -> UpdateItemResponse | None:
    item_db = await repository.get_item_by_id(session, item_id)
    if item_db:
        item_db = await repository.update_item(session, item_db, item_in)

    if not item_db:
        return None

    item_out = ItemOut.from_db(item_db)

    return UpdateItemResponse(item=item_out)



