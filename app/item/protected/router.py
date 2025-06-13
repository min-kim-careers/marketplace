from uuid import UUID
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.database import get_session
from app.common.schemas.error import ErrorResponse
from app.item.protected import service
from app.item.protected.schemas.requests import ItemCreateRequest, ItemUpdateRequest
from app.item.schemas.responses import ItemResponse

items_protected_router = APIRouter()


@items_protected_router.post(
    "/{user_id}", response_model=ItemResponse
)
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


@items_protected_router.patch(
    "/{item_id}", response_model=ItemResponse
)
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
