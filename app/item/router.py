from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.database import get_session
from app.common.schemas.error import ErrorResponse
from app.item import service
from app.item.schemas.requests import ItemCreateRequest, ItemUpdateRequest
from app.item.schemas.requests import ItemsRequest
from app.item.schemas.responses import ItemResponse

items_router = APIRouter()


@items_router.get("", response_model=ItemResponse)
async def get_items(
    query: ItemsRequest = Depends(),
    session: AsyncSession = Depends(get_session),
) -> ItemResponse:
    res = await service.get_paginated_items_with_count(session, query)
    if not res:
        raise ErrorResponse(status_code=404, message="Items not found")

    items, count = res

    data = dict(
        items=items,
        count=count,
    )

    return ItemResponse(
        success=True,
        data=data,
    )


@items_router.post("/{user_id}", response_model=ItemResponse)
async def create_item(
    user_id: UUID,
    item_in: ItemCreateRequest,
    session: AsyncSession = Depends(get_session),
) -> ItemResponse:
    item = await service.create_item(session, user_id, item_in)
    if not item:
        raise ErrorResponse(status_code=404, message="Failed to create item")

    data = dict(
        item=item,
    )

    return ItemResponse(
        success=True,
        data=data,
    )


@items_router.delete("/{item_id}", response_model=ItemResponse)
async def delete_item(
    item_id: int,
    session: AsyncSession = Depends(get_session),
) -> ItemResponse:
    deleted = await service.delete_item(session, item_id)
    if not deleted:
        raise ErrorResponse(status_code=404, message="Failed to delete item")

    data = dict(
        deleted=deleted,
    )

    return ItemResponse(
        success=True,
        data=data,
    )


@items_router.patch("/{item_id}", response_model=ItemResponse)
async def update_item(
    item_id: int,
    item_in: ItemUpdateRequest,
    session: AsyncSession = Depends(get_session),
) -> ItemResponse:
    item = await service.update_item(session, item_id, item_in)
    if not item:
        raise ErrorResponse(status_code=404, message="Failed to update item")

    data = dict(
        item=item,
    )

    return ItemResponse(
        success=True,
        data=data,
    )


@items_router.post("/{item_id}/upload/images", response_model=ItemResponse)
async def upload_images(
    item_id: int,
    images: List[UploadFile] = File(...),
    session: AsyncSession = Depends(get_session),
) -> ItemResponse:
    item = await service.upload_images(session, item_id, images)
    if not item:
        raise ErrorResponse(status_code=404, message="Failed to upload images")

    data = dict(
        item=item,
    )

    return ItemResponse(
        success=True,
        data=data,
    )
