from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.database import get_session
from app.common.schemas.error import ErrorResponse
from app.crud.item import (
    get_item_by_id,
    get_items_count,
    get_items_paginated,
    upsert_item_db,
)
from app.models.item import Item
from app.schemas.item.requests import GetItemsRequest, ItemUpsertRequest
from app.schemas.item.responses import GetItemsResponse, ItemResponse

items_router = APIRouter()


@items_router.get("", response_model=ItemResponse[GetItemsResponse])
async def get_items(
    query: GetItemsRequest = Depends(),
    session: AsyncSession = Depends(get_session),
) -> ItemResponse[GetItemsResponse]:
    items = await get_items_paginated(session, query)
    if not items:
        raise ErrorResponse(status_code=404, message="Items not found")

    count = await get_items_count(session, query)

    data = GetItemsResponse(
        items=items,
        count=count,
    )

    return ItemResponse[GetItemsResponse](success=True, data=data)


@items_router.get("/{item_id}", response_model=ItemResponse)
async def get_item(
    item_id: int, session: AsyncSession = Depends(get_session)
) -> ItemResponse:
    item = await get_item_by_id(session, item_id)
    if not item:
        raise ErrorResponse(status_code=404, message="Item not found")
    return ItemResponse[Item](success=True, data=item)


@items_router.put("", response_model=ItemResponse)
async def upsert_item(
    item_in: ItemUpsertRequest, session: AsyncSession = Depends(get_session)
) -> ItemResponse:
    item = Item(**item_in.model_dump())
    data = await upsert_item_db(session, item)
    return ItemResponse[Item](success=True, data=data)
