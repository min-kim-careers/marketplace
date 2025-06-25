import re
from typing import Annotated, List, Optional
from uuid import UUID
from fastapi import APIRouter, Body, Depends, File, Form, Path, Query, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.item import ItemDB
from app.db.config.session import get_session
from app.common.schemas.error import ErrorResponse
from app.db.repositories.item import ItemRepository
from app.item.dependencies import resolve_item, resolve_item_slug
from app.item.schemas.outbound import ItemOut
from app.item.schemas.inbound import ItemIn
from app.item.schemas.inbound import ItemsQuery
from app.item.schemas.outbound import ItemResponse
from app.item.service import ItemService
from app.profile.schemas.outbound import ProfileResponse
from app.storage.image import remove_image_bulk, store_image_bulk
from rich import print

items_router = APIRouter()


@items_router.get("", response_model=ItemResponse)
async def get_items(
    query: ItemsQuery = Depends(),
    session: AsyncSession = Depends(get_session),
) -> ItemResponse:
    item_count = await ItemRepository.get_items_count(session, query)
    if not item_count:
        return ItemResponse(data={"items": [], "count": 0})

    items_db = await ItemRepository.get_items(session, query)
    if not items_db:
        raise ErrorResponse(status_code=500, message="Error fetching items")

    return ItemResponse(
        data={
            "items": [ItemOut.from_db(item) for item in items_db],
            "count": item_count,
        },
    )


@items_router.get("/user/{user_id}", response_model=ItemResponse)
async def get_user_items(
    user_id: UUID = Path(...),
    query: ItemsQuery = Depends(),
    session: AsyncSession = Depends(get_session),
) -> ItemResponse:
    item_count = await ItemRepository.get_user_items_count(session, user_id, query)
    if not item_count:
        return ItemResponse(data={"items": [], "count": 0})

    items_db = await ItemRepository.get_user_items(session, user_id, query)
    if not items_db:
        raise ErrorResponse(status_code=500, message="Error fetching user's items")

    return ItemResponse(
        data={
            "items": [ItemOut.from_db(item) for item in items_db],
            "count": item_count,
        },
    )


@items_router.get("/user/{user_id}/item/{item_slug}", response_model=ProfileResponse)
async def get_user_item(
    item_db: ItemDB = Depends(resolve_item),
) -> ProfileResponse:
    item = ItemOut.from_db(item_db)

    return ProfileResponse(
        data={"item": item},
    )


@items_router.delete("/user/{user_id}/item/{item_slug}", response_model=ItemResponse)
async def delete_user_item(
    item_db: ItemDB = Depends(resolve_item),
    session: AsyncSession = Depends(get_session),
) -> ItemResponse:
    deleted = await ItemRepository.delete_item(session, item_db)
    if not deleted:
        raise ErrorResponse(status_code=404, message="Failed to delete item")

    return ItemResponse(
        data={"deleted": deleted},
    )


@items_router.put("/user/{user_id}", response_model=ItemResponse)
async def upsert_user_item(
    item_in: Annotated[ItemIn, Form()],
    user_id: UUID = Path(...),
    item_id: UUID | None = Depends(resolve_item_slug),
    session: AsyncSession = Depends(get_session),
) -> ItemResponse:
    item_db = None
    if item_id:
        item_db = await ItemRepository.get_item_by_id_and_user(
            session, user_id, item_id
        )

    new_image_urls = []
    if item_in.upload_images and item_in.image_urls:
        new_image_urls = await ItemService.upload_images_and_get_urls(
            item_in.upload_images, item_in.image_urls
        )
        if not new_image_urls:
            raise ErrorResponse(status_code=404, message="Image upload error")

    new_item_db = await ItemService.upsert_item(session, user_id, item_in, item_db)

    if not new_item_db:
        if new_image_urls:
            remove_image_bulk(new_image_urls)
        raise ErrorResponse(status_code=404, message="Item upsert error")

    item = ItemOut.from_db(new_item_db)

    return ItemResponse(
        data={"item": item},
    )
