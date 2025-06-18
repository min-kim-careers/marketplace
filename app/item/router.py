from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Body, Depends, File, Path, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.item import ItemDB
from app.db.session import get_session
from app.common.schemas.error import ErrorResponse
from app.item import service
from app.item.dependencies import resolve_item
from app.item.schemas.common import ItemOut
from app.item.schemas.requests import ItemCreateRequest, ItemUpdateRequest
from app.item.schemas.requests import ItemsRequest
from app.item.schemas.responses import ItemResponse
from app.profile.schemas.responses import ProfileResponse
from app.storage.image import store_images

items_router = APIRouter()


@items_router.get("", response_model=ItemResponse)
async def get_items(
    query: ItemsRequest = Depends(),
    session: AsyncSession = Depends(get_session),
) -> ItemResponse:
    data = {"items": [], "count": 0}

    items_db = await service.get_all_items(session, query)
    if items_db:
        data["items"] = [ItemOut.from_db(item) for item in items_db]

        data["count"] = await service.get_all_items_count(session, query)

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

    items_db = await service.get_user_items(session, user_id, query)
    if items_db:
        data["items"] = [ItemOut.from_db(item) for item in items_db]

        data["count"] = await service.get_user_items_count(session, user_id, query)

    return ItemResponse(
        success=True,
        data=data,
    )


@items_router.get("/user/{user_id}/item/{item_slug}", response_model=ProfileResponse)
async def get_user_item(
    item_db: ItemDB = Depends(resolve_item),
) -> ProfileResponse:
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
    deleted = await service.delete_item(session, item_db)
    if not deleted:
        raise ErrorResponse(status_code=404, message="Failed to delete item")

    return ItemResponse(
        success=True,
        data={"deleted": deleted},
    )


@items_router.patch("/user/{user_id}/item/{item_slug}", response_model=ItemResponse)
async def update_user_item(
    item_in: ItemUpdateRequest = Body(...),
    item_db: ItemDB = Depends(resolve_item),
    session: AsyncSession = Depends(get_session),
) -> ItemResponse:
    print(item_db)
    print(item_in)
    return ItemResponse(success=True)
    item_db = await service.get_item_by_id_and_user(session, user_id, item_id)
    if not item_db:
        raise ErrorResponse(status_code=404, message="Item not found")

    item_db = await service.update_item(session, item_db, item_in)
    if not item_db:
        raise ErrorResponse(status_code=404, message="Failed to update item")

    item = ItemOut.from_db(item_db)

    return ItemResponse(
        success=True,
        data={"item": item},
    )


@items_router.post("/user/{user_id}", response_model=ItemResponse)
async def create_user_item(
    item_db: ItemDB = Depends(resolve_item),
    session: AsyncSession = Depends(get_session),
) -> ItemResponse:
    print(item_db)
    return ItemResponse(success=True)
    item_db = await service.create_item(session, user_id, item_in)
    if not item_db:
        raise ErrorResponse(status_code=404, message="Failed to create item")

    item = ItemOut.from_db(item_db)

    return ItemResponse(
        success=True,
        data={"item": item},
    )


@items_router.post(
    "/user/{user_id}/item/{item_slug}/upload/images", response_model=ItemResponse
)
async def upload_user_item_images(
    item_db: ItemDB = Depends(resolve_item),
    images: List[UploadFile] = File(...),
    session: AsyncSession = Depends(get_session),
) -> ItemResponse:
    print(item_db)
    print(images)
    raise ErrorResponse(404)
    item_db = await service.get_item_by_id_and_user(session, user_id, item_id)
    if not item_db:
        raise ErrorResponse(status_code=404, message="Item not found")

    image_urls = await store_images(images)
    if not len(image_urls):
        raise ErrorResponse(status_code=404, message="Failed to upload images")

    item_db = await service.update_image_urls(session, item_db, image_urls)
    if not item_db:
        raise ErrorResponse(status_code=404, message="Failed to insert image urls")

    item = ItemOut.from_db(item_db)

    return ItemResponse(
        success=True,
        data={"item": item},
    )
