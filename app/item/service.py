from typing import List, Optional, Tuple
from uuid import UUID

from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.item import repository
from app.item.schemas.requests import ItemCreateRequest, ItemUpdateRequest
from app.item.schemas.requests import ItemsRequest
from app.item.schemas.common import ItemOut
from app.profile.repository import get_profile_by_user
from app.storage.image import store_images


async def get_paginated_items_with_count(
    session: AsyncSession,
    query: ItemsRequest,
) -> Tuple[List[ItemOut], int] | None:
    items_db = await repository.get_items_paginated(session, query)
    if not items_db:
        return None

    count = await repository.get_items_count(session, query)

    items_out = [ItemOut.from_db(item) for item in items_db]

    return items_out, count


async def create_item(
    session: AsyncSession,
    user_id: UUID,
    item_in: ItemCreateRequest,
) -> ItemOut | None:
    profile_db = await get_profile_by_user(session, user_id)
    if not profile_db:
        print("No profile found")
        return None

    item_db = await repository.create_item(session, profile_db.id, item_in)
    if not item_db:
        return None

    return ItemOut.from_db(item_db)


async def delete_item(
    session: AsyncSession,
    item_id: int,
) -> bool:
    item_db = await repository.get_item_by_id(session, item_id)
    if not item_db:
        return False

    return await repository.delete_item(session, item_db)


async def update_item(
    session: AsyncSession,
    item_id: int,
    item_in: ItemUpdateRequest,
) -> ItemOut | None:
    item_db = await repository.get_item_by_id(session, item_id)
    if item_db:
        item_db = await repository.update_item(session, item_db, item_in)

    if not item_db:
        return None

    return ItemOut.from_db(item_db)


async def upload_images(
    session: AsyncSession, item_id: int, images: List[UploadFile]
) -> ItemOut | None:
    item_db = await repository.get_item_by_id(session, item_id)
    if not item_db:
        return None

    image_urls = await store_images(images)
    if not len(image_urls):
        return None

    item_db = await repository.update_image_urls(session, item_db, image_urls)
    if not item_db:
        return None

    return ItemOut.from_db(item_db)
