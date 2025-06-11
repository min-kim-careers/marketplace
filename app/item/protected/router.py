from uuid import UUID
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.database import get_session
from app.common.schemas.error import ErrorResponse
from app.item.protected import service
from app.item.protected.schemas.requests import ItemCreate, ItemUpdate
from app.item.protected.schemas.responses import CreateItemResponse, UpdateItemResponse
from app.item.schemas.response import ItemResponse

items_protected_router = APIRouter()


@items_protected_router.post(
    "/{user_id}", response_model=ItemResponse[CreateItemResponse]
)
async def create_item(
    user_id: UUID,
    item_in: ItemCreate,
    session: AsyncSession = Depends(get_session),
) -> ItemResponse[CreateItemResponse]:
    data = await service.create_item(session, user_id, item_in)
    if not data:
        raise ErrorResponse(status_code=404, message="Failed to create item")

    return ItemResponse[CreateItemResponse](
        success=True,
        data=data,
    )


@items_protected_router.patch(
    "/{item_id}", response_model=ItemResponse[UpdateItemResponse]
)
async def update_item(
    item_id: int,
    item_in: ItemUpdate,
    session: AsyncSession = Depends(get_session),
) -> ItemResponse[UpdateItemResponse]:
    data = await service.update_item(session, item_id, item_in)
    if not data:
        raise ErrorResponse(status_code=404, message="Failed to update item")

    return ItemResponse[UpdateItemResponse](
        success=True,
        data=data,
    )
