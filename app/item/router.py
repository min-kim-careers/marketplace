import re
from typing import Annotated, List, Optional
from uuid import UUID

from fastapi import APIRouter, Body, Depends, File, Form, Path, Query, UploadFile
from rich import print
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.firebase.dependencies import (
    resolve_firebase_session,
    resolve_firebase_session_optional,
)
from app.core import utils
from app.core.schemas.error import ErrorResponse
from app.db.models.user import UserDB
from app.db.session import get_db
from app.db.models.item import ItemDB
from app.item.dependencies import resolve_item, resolve_item_slug
from app.item.repository import ItemRepository
from app.item.schemas.inbound import ItemInForm, ItemsQuery
from app.item.schemas.outbound import ItemOut, ItemResponse
from app.item.service import ItemService
from app.profile.schemas.outbound import ProfileResponse
from app.storage.image import remove_image_bulk

items_router = APIRouter(prefix="/api/items", tags=["Items"])


@items_router.get("", response_model=ItemResponse)
async def get_items(
    user: UserDB | None = Depends(resolve_firebase_session_optional),
    query: ItemsQuery = Depends(),
    db: AsyncSession = Depends(get_db),
) -> ItemResponse:
    return await ItemService.get_items(db, query, user.id if user else None)


@items_router.get("/count", response_model=ProfileResponse)
async def get_item_count_for_user(
    user: UserDB = Depends(resolve_firebase_session),
    db: AsyncSession = Depends(get_db),
) -> ProfileResponse:
    return ProfileResponse(
        data={
            "count": await ItemRepository.get_item_count_for_user(db, user.id),
        },
    )


@items_router.get("/item/{item_slug}", response_model=ProfileResponse)
async def get_item_by_slug(
    item_db: ItemDB = Depends(resolve_item),
) -> ProfileResponse:
    return ProfileResponse(
        data={"item": ItemOut.from_db(item_db)},
    )


@items_router.delete("/item/{item_slug}", response_model=ItemResponse)
async def delete_item_by_slug(
    item_db: ItemDB = Depends(resolve_item),
    db: AsyncSession = Depends(get_db),
) -> ItemResponse:
    await ItemService.delete_item(db, item_db)

    return ItemResponse(message="Item deleted")


@items_router.put("", response_model=ItemResponse)
async def upsert_item(
    item_in: Annotated[ItemInForm, Form()],
    user: UserDB = Depends(resolve_firebase_session),
    item_id: UUID | None = Depends(resolve_item_slug),
    db: AsyncSession = Depends(get_db),
) -> ItemResponse:
    item_db = None
    if item_id:
        item_db = await ItemRepository.get_by_item_and_user_id(db, user.id, item_id)

    new_image_urls = []
    if item_in.upload_images and item_in.image_urls:
        new_image_urls = await ItemService.upload_images_and_get_urls(
            item_in.upload_images, item_in.image_urls
        )
        if not new_image_urls:
            raise ErrorResponse(status_code=404, message="Image upload error")
        else:
            item_in.image_urls = new_image_urls

    new_item_db = await ItemService.upsert_item(db, user.id, item_in, item_db)
    if not new_item_db:
        if new_image_urls:
            remove_image_bulk(new_image_urls)
        raise ErrorResponse(status_code=404, message="Item upsert error")

    item = ItemOut.from_db(new_item_db)

    return ItemResponse(
        data={"item": item},
    )


@items_router.get("/slugs", response_model=ProfileResponse)
async def get_items_by_slugs(
    _=Depends(resolve_firebase_session),
    item_slugs: List[str] = Query(..., alias="itemSlugs"),
    db: AsyncSession = Depends(get_db),
) -> ProfileResponse:
    item_ids = [utils.decode_slug(i) for i in item_slugs]

    item_dbs = await ItemRepository.get_by_items_and_user_id(db, item_ids)

    items = []
    for item_id in item_ids:
        for item_db in item_dbs:
            if item_db.id == item_id:
                items += [ItemOut.from_db(item_db)]

    if len(items) != len(item_ids):
        raise ErrorResponse(status_code=404, message="Error getting items by ids")

    return ProfileResponse(
        data={
            "items": items,
        },
    )
