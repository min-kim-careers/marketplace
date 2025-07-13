import re
from typing import Annotated, List, Optional
from uuid import UUID
from fastapi import APIRouter, Body, Depends, File, Form, Path, Query, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.common import utils
from app.item.models.item import ItemDB
from app.db.session import get_db
from app.common.schemas.error import ErrorResponse
from app.item.repositories.item import ItemRepository
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
    db: AsyncSession = Depends(get_db),
) -> ItemResponse:
    item_count = await ItemRepository.get_all_count(db, query)
    if not item_count:
        return ItemResponse(data={"items": [], "count": 0})

    items_db = await ItemRepository.get_all(db, query)
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
    db: AsyncSession = Depends(get_db),
) -> ItemResponse:
    item_count = await ItemRepository.get_all_count_by_user_id(db, user_id, query)
    if not item_count:
        return ItemResponse(data={"items": [], "count": 0})

    items_db = await ItemRepository.get_all_by_user_id(db, user_id, query)
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
    db: AsyncSession = Depends(get_db),
) -> ItemResponse:
    deleted = await ItemRepository.delete(db, item_db)
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
    db: AsyncSession = Depends(get_db),
) -> ItemResponse:
    item_db = None
    if item_id:
        item_db = await ItemRepository.get_by_item_and_user_id(db, user_id, item_id)

    new_image_urls = []
    if item_in.upload_images and item_in.image_urls:
        new_image_urls = await ItemService.upload_images_and_get_urls(
            item_in.upload_images, item_in.image_urls
        )
        if not new_image_urls:
            raise ErrorResponse(status_code=404, message="Image upload error")

    new_item_db = await ItemService.upsert_item(db, user_id, item_in, item_db)

    if not new_item_db:
        if new_image_urls:
            remove_image_bulk(new_image_urls)
        raise ErrorResponse(status_code=404, message="Item upsert error")

    item = ItemOut.from_db(new_item_db)

    return ItemResponse(
        data={"item": item},
    )


@items_router.get("/items/slugs", response_model=ProfileResponse)
async def get_items_by_ids(
    item_slugs: List[str] = Query(..., alias="itemSlugs"),
    db: AsyncSession = Depends(get_db),
) -> ProfileResponse:
    item_ids = [utils.decode_slug(i) for i in set(item_slugs)]

    item_dbs = await ItemRepository.get_by_items_and_user_id(db, item_ids)

    items = [ItemOut.from_db(i) for i in item_dbs]
    order = [
        next((idx for idx, item in enumerate(items) if item.id == _id), None)
        for _id in item_slugs
    ]

    if None in order or len(items) != len(order):
        raise ErrorResponse(status_code=404, message="Error getting items by ids")
    
    return ProfileResponse(
        data={
            "items": items,
            "order": order,
        },
    )
