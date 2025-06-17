from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_session
from app.common.schemas.error import ErrorResponse
from app.item import service as item_service
from app.item.schemas.requests import ItemCreateRequest, ItemUpdateRequest
from app.item.schemas.requests import ItemsRequest
from app.item.schemas.responses import ItemResponse
from app.profile import service as profile_service, service
from app.profile.schemas.responses import ProfileResponse

items_router = APIRouter()


@items_router.get("", response_model=ItemResponse)
async def get_items(
    query: ItemsRequest = Depends(),
    session: AsyncSession = Depends(get_session),
) -> ItemResponse:
    items, count = await item_service.get_paginated_items_with_count(session, query)

    data = dict(
        items=items,
        count=count,
    )

    return ItemResponse(
        success=True,
        data=data,
    )


@items_router.get("/user/{user_id}/item/{item_id}", response_model=ProfileResponse)
async def get_user_item(
    user_id: UUID,
    item_id: int,
    session: AsyncSession = Depends(get_session),
) -> ProfileResponse:
    item = await service.get_user_item(session, user_id, item_id)
    if not item:
        raise ErrorResponse(status_code=404, message="Failed to get user item")

    data = dict(item=item)

    return ProfileResponse(
        success=True,
        data=data,
    )


@items_router.delete("/user/{user_id}/item/{item_id}", response_model=ItemResponse)
async def delete_user_item(
    user_id: UUID,
    item_id: int,
    session: AsyncSession = Depends(get_session),
) -> ItemResponse:
    deleted = await item_service.delete_user_item(session, user_id, item_id)
    if not deleted:
        raise ErrorResponse(status_code=404, message="Failed to delete item")

    data = dict(
        deleted=deleted,
    )

    return ItemResponse(
        success=True,
        data=data,
    )


@items_router.patch("/user/{user_id}/item/{item_id}", response_model=ItemResponse)
async def update_user_item(
    user_id: UUID,
    item_id: int,
    item_in: ItemUpdateRequest,
    session: AsyncSession = Depends(get_session),
) -> ItemResponse:
    item = await item_service.update_user_item(session, item_id, item_in)
    if not item:
        raise ErrorResponse(status_code=404, message="Failed to update item")

    data = dict(
        item=item,
    )

    return ItemResponse(
        success=True,
        data=data,
    )


@items_router.post("/user/{user_id}", response_model=ItemResponse)
async def create_user_item(
    user_id: UUID,
    item_in: ItemCreateRequest,
    session: AsyncSession = Depends(get_session),
) -> ItemResponse:
    item = await item_service.create_user_item(session, user_id, item_in)
    if not item:
        raise ErrorResponse(status_code=404, message="Failed to create item")

    data = dict(
        item=item,
    )

    return ItemResponse(
        success=True,
        data=data,
    )


@items_router.post(
    "/user/{user_id}/item/{item_id}/upload/images", response_model=ItemResponse
)
async def upload_user_item_images(
    user_id: UUID,
    item_id: int,
    images: List[UploadFile] = File(...),
    session: AsyncSession = Depends(get_session),
) -> ItemResponse:
    item = await item_service.upload_user_item_images(session, item_id, images)
    if not item:
        raise ErrorResponse(status_code=404, message="Failed to upload images")

    data = dict(
        item=item,
    )

    return ItemResponse(
        success=True,
        data=data,
    )
