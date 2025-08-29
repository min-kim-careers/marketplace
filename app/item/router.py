from typing import Annotated, List
from uuid import UUID

from app.auth.firebase.dependencies import (
    resolve_firebase_session,
    resolve_firebase_session_optional,
)
from app.core import helpers
from app.core.schemas.error import ErrorResponse
from app.core.schemas.outbound import APIResponse
from app.core.security import verify_service_key
from app.db.models.item import ItemDB
from app.db.models.user import UserDB
from app.db.session import get_db
from app.item.dependencies import resolve_item, resolve_item_alias_query
from app.item.repository import ItemRepository
from app.item.schemas.inbound import ItemInForm, ItemsQuery
from app.item.schemas.outbound import ItemOut
from app.item.service import ItemService
from app.storage.image import remove_image_bulk
from fastapi import APIRouter, Depends, Form, Query
from sqlalchemy.ext.asyncio import AsyncSession

items_router = APIRouter(
    prefix="/api/items",
    tags=["Items"],
    dependencies=[Depends(verify_service_key)],
)


@items_router.get("", response_model=APIResponse)
async def get_items(
    query: Annotated[ItemsQuery, Query()],
    user: UserDB | None = Depends(resolve_firebase_session_optional),
    db: AsyncSession = Depends(get_db),
) -> APIResponse:
    return await ItemService.get_items(db, query, user.id if user else None)


@items_router.get("/count", response_model=APIResponse)
async def get_item_count_for_user(
    user: UserDB = Depends(resolve_firebase_session),
    db: AsyncSession = Depends(get_db),
) -> APIResponse:
    return APIResponse(
        data={
            "count": await ItemRepository.count_for_user(db, user.id),
        },
    )


@items_router.get("/item/{itemAlias}", response_model=APIResponse)
async def get_item_by_alias(
    item_db: ItemDB = Depends(resolve_item),
) -> APIResponse:
    return APIResponse(
        data={"item": ItemOut.from_db(item_db)},
    )


@items_router.delete("/item/{itemAlias}", response_model=APIResponse)
async def delete_item_by_alias(
    item_db: ItemDB = Depends(resolve_item),
    db: AsyncSession = Depends(get_db),
) -> APIResponse:
    await ItemService.delete_item(db, item_db)

    return APIResponse(message="Item deleted")


@items_router.put("", response_model=APIResponse)
async def upsert_item(
    item_in: Annotated[ItemInForm, Form()],
    user: UserDB = Depends(resolve_firebase_session),
    item_id: UUID | None = Depends(resolve_item_alias_query),
    db: AsyncSession = Depends(get_db),
) -> APIResponse:
    item_db = None
    if item_id:
        item_db = await ItemRepository.by_item_and_user(db, user.id, item_id)

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

    return APIResponse(
        data={"item": item},
    )


@items_router.get("/aliases", response_model=APIResponse)
async def get_items_by_aliases(
    _=Depends(resolve_firebase_session),
    item_aliases: List[str] = Query(..., alias="aliases"),
    db: AsyncSession = Depends(get_db),
) -> APIResponse:
    item_ids = [helpers.decode_uuid(i) for i in item_aliases]

    item_dbs = await ItemRepository.by_items_and_user(db, item_ids)

    items = []
    for item_id in item_ids:
        for item_db in item_dbs:
            if item_db.id == item_id:
                items += [ItemOut.from_db(item_db)]

    if len(items) != len(item_ids):
        raise ErrorResponse(status_code=404, message="Error getting items by ids")

    return APIResponse(
        data={
            "items": items,
        },
    )
