from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.database import get_session
from app.common.schemas.error import ErrorResponse
from app.item import service
from app.item.schemas.requests import GetItemsRequest
from app.item.schemas.responses import GetItemsResponse, ItemResponse

items_router = APIRouter()


@items_router.get("", response_model=ItemResponse[GetItemsResponse])
async def get_items(
    query: GetItemsRequest = Depends(),
    session: AsyncSession = Depends(get_session),
) -> ItemResponse[GetItemsResponse]:
    result = await service.get_paginated_items_with_count(session, query)
    if not result:
        raise ErrorResponse(status_code=404, message="Items not found")

    data = GetItemsResponse(
        items=result["items"],
        count=result["count"],
    )

    return ItemResponse[GetItemsResponse](
        success=True,
        data=data,
    )
