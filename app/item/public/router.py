from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.database import get_session
from app.common.schemas.error import ErrorResponse
from app.item.public import service
from app.item.public.schemas.requests import GetItemsRequest
from app.item.schemas.responses import ItemResponse

items_public_router = APIRouter()


@items_public_router.get("", response_model=ItemResponse)
async def get_items(
    query: GetItemsRequest = Depends(),
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
