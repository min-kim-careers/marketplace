from typing import Annotated
from uuid import UUID

from app.auth.firebase.dependencies import (
    resolve_firebase_session,
    resolve_firebase_session_optional,
)
from app.core.schemas.outbound import APIResponse
from app.core.security import verify_service_key
from app.db.models.item import ItemDB
from app.db.models.user import UserDB
from app.db.session import get_db
from app.item.dependencies import resolve_item, resolve_item_alias_query
from app.item.repository import ItemRepository
from app.item.schemas.inbound import ItemInForm, ItemsQuery
from app.item.schemas.outbound import ItemOut
from app.item.service import ItemService
from fastapi import APIRouter, Depends, Form, Query
from sqlalchemy.ext.asyncio import AsyncSession

items_router = APIRouter(
    prefix="/api/items",
    tags=["Items"],
    dependencies=[Depends(verify_service_key)],
)


@items_router.get("")
async def get_items(
    query: Annotated[ItemsQuery, Query()],
    user: UserDB | None = Depends(resolve_firebase_session_optional),
    db: AsyncSession = Depends(get_db),
):
    return await ItemService.get_items(db, query, user.id if user else None)


@items_router.get("/count")
async def get_item_count_for_user(
    user: UserDB = Depends(resolve_firebase_session),
    db: AsyncSession = Depends(get_db),
):
    return APIResponse(
        data={
            "count": await ItemRepository.count_for_user(db, user.id),
        },
    )


@items_router.get("/item/{itemAlias}")
async def get_item_by_alias(
    item_db: ItemDB = Depends(resolve_item),
):
    return APIResponse(
        data={"item": ItemOut.from_db(item_db)},
    )


@items_router.delete("/item/{itemAlias}")
async def delete_item_by_alias(
    item_db: ItemDB = Depends(resolve_item),
    db: AsyncSession = Depends(get_db),
):
    await ItemService.delete_item(db, item_db)

    return APIResponse(message="Item deleted")


@items_router.put("")
async def upsert_item(
    item_form: Annotated[ItemInForm, Form()],
    user: UserDB = Depends(resolve_firebase_session),
    item_id: UUID | None = Depends(resolve_item_alias_query),
    db: AsyncSession = Depends(get_db),
):
    print(item_form)
    item_db = None
    # check existing item
    if item_id:
        item_db = await ItemRepository.by_id_and_user(db, user.id, item_id)

    # upsert item
    new_item_db = await ItemService.upsert_item(
        db,
        user.id,
        item_form,
        item_db,
    )

    return APIResponse(
        data={"item": ItemOut.from_db(new_item_db)},
    )
