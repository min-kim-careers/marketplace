import re
from typing import Annotated, List, Optional
from uuid import UUID
from fastapi import APIRouter, Body, Depends, File, Form, Path, Query, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.item import ItemDB
from app.db.session import get_session
from app.common.schemas.error import ErrorResponse
from app.item import repository
from app.item.dependencies import resolve_item, resolve_item_slug
from app.item.schemas.common import ItemOut
from app.item.schemas.requests import ItemInRequest
from app.item.schemas.requests import ItemsRequest
from app.item.schemas.responses import ItemResponse
from app.item.service import upload_images_and_get_urls
from app.profile.schemas.responses import ProfileResponse
from app.storage.image import remove_image_bulk, store_image_bulk
from rich import print

items_router = APIRouter()


@items_router.get("", response_model=ItemResponse)
async def get_items(
    query: ItemsRequest = Depends(),
    session: AsyncSession = Depends(get_session),
) -> ItemResponse:
    data = {"items": [], "count": 0}

    items_db = await repository.get_all_items(session, query)
    if items_db:
        data["items"] = [ItemOut.from_db(item) for item in items_db]
        data["count"] = await repository.get_all_items_count(session, query)

    return ItemResponse(
        success=True,
        data=data,
    )


@items_router.get("/user/{user_id}", response_model=ItemResponse)
async def get_user_items(
    user_id: UUID = Path(...),
    query: ItemsRequest = Depends(),
    session: AsyncSession = Depends(get_session),
) -> ItemResponse:
    data = {"items": [], "count": 0}

    items_db = await repository.get_user_items(session, user_id, query)
    if items_db:
        data["items"] = [ItemOut.from_db(item) for item in items_db]
        data["count"] = await repository.get_user_items_count(session, user_id, query)

    return ItemResponse(
        success=True,
        data=data,
    )


@items_router.get("/user/{user_id}/item/{item_slug}", response_model=ProfileResponse)
async def get_user_item(
    item_db: ItemDB = Depends(resolve_item),
) -> ProfileResponse:
    if not item_db:
        raise ErrorResponse(status_code=404, message="Item not found")

    item = ItemOut.from_db(item_db)

    return ProfileResponse(
        success=True,
        data={"item": item},
    )


@items_router.delete("/user/{user_id}/item/{item_slug}", response_model=ItemResponse)
async def delete_user_item(
    item_db: ItemDB = Depends(resolve_item),
    session: AsyncSession = Depends(get_session),
) -> ItemResponse:
    if not item_db:
        raise ErrorResponse(status_code=404, message="Item not found")

    deleted = await repository.delete_item(session, item_db)
    if not deleted:
        raise ErrorResponse(status_code=404, message="Failed to delete item")

    return ItemResponse(
        success=True,
        data={"deleted": deleted},
    )


@items_router.put("/user/{user_id}", response_model=ItemResponse)
async def upsert_user_item(
    item_in: Annotated[ItemInRequest, Form()],
    user_id: UUID = Path(...),
    item_id: UUID | None = Depends(resolve_item_slug),
    session: AsyncSession = Depends(get_session),
) -> ItemResponse:
    item_db: ItemDB | None
    if item_id:
        item_db = await repository.get_item_by_id_and_user(session, user_id, item_id)

    new_image_urls = []
    if item_in.upload_images and item_in.image_urls:
        new_image_urls = await upload_images_and_get_urls(
            item_in.upload_images, item_in.image_urls
        )
        if not new_image_urls:
            raise ErrorResponse(status_code=404, message="Image upload error")

    new_item_db: ItemDB | None
    if item_db:
        new_item_db = await repository.update_item(session, item_db, item_in)
    else:
        new_item_db = await repository.create_item(session, user_id, item_in)

    if not new_item_db:
        if new_image_urls:
            remove_image_bulk(new_image_urls)
        raise ErrorResponse(status_code=404, message="Item upsert error")

    item = ItemOut.from_db(new_item_db)

    return ItemResponse(
        success=True,
        data={"item": item},
    )


# @items_router.put("/user/{user_id}/item/{item_slug}", response_model=ItemResponse)
# async def update_user_item(
#     item_in: Annotated[ItemInRequest, Form()],
#     item_db: ItemDB = Depends(resolve_item),
#     session: AsyncSession = Depends(get_session),
# ) -> ItemResponse:
#     new_image_urls = []
#     if item_in.upload_images and item_in.image_urls:
#         new_image_urls = await upload_images_and_get_urls(
#             item_in.upload_images, item_in.image_urls
#         )
#         if not new_image_urls:
#             raise ErrorResponse(status_code=404, message="Image upload error")

#     updated_item_db = await repository.update_item(session, item_db, item_in)

#     if not updated_item_db:
#         if new_image_urls:
#             remove_image_bulk(new_image_urls)
#         raise ErrorResponse(status_code=404, message="Item upsert error")

#     item = ItemOut.from_db(updated_item_db)

#     return ItemResponse(
#         success=True,
#         data={"item": item},
#     )


# @items_router.post("/user/{user_id}", response_model=ItemResponse)
# async def create_user_item(
#     item_in: Annotated[ItemInRequest, Form()],
#     user_id: UUID = Path(...),
#     session: AsyncSession = Depends(get_session),
# ) -> ItemResponse:
#     new_image_urls = []
#     if item_in.upload_images and item_in.image_urls:
#         new_image_urls = await upload_images_and_get_urls(
#             item_in.upload_images, item_in.image_urls
#         )
#         if not new_image_urls:
#             raise ErrorResponse(status_code=404, message="Image upload error")

#     item_db = await repository.create_item(session, user_id, item_in)

#     if not item_db:
#         if new_image_urls:
#             remove_image_bulk(new_image_urls)
#         raise ErrorResponse(status_code=404, message="Item upsert error")

#     item = ItemOut.from_db(item_db)

#     return ItemResponse(
#         success=True,
#         data={"item": item},
#     )
