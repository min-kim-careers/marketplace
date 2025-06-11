from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.database import get_session
from app.common.schemas.error import ErrorResponse
from app.item.public import service
from app.item.public.schemas.requests import GetItemsRequest
from app.item.public.schemas.responses import (
    GetItemsResponse,
)
from app.item.schemas.response import ItemResponse

items_public_router = APIRouter()


@items_public_router.get("", response_model=ItemResponse[GetItemsResponse])
async def get_items(
    query: GetItemsRequest = Depends(),
    session: AsyncSession = Depends(get_session),
) -> ItemResponse[GetItemsResponse]:
    data = await service.get_paginated_items_with_count(session, query)
    if not data:
        raise ErrorResponse(status_code=404, message="Items not found")

    return ItemResponse[GetItemsResponse](
        success=True,
        data=data,
    )

