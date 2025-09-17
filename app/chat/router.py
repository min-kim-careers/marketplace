from typing import Annotated
from uuid import UUID
from fastapi import APIRouter, Depends, Query

from app.auth.firebase.dependencies import resolve_firebase_session
from app.chat.dependencies.resolve_room_alias import resolve_room_alias
from app.chat.repositories.chat_room import ChatRoomRepository
from app.chat.schemas.inbound import ChatRoomInDB, RoomsQuery
from app.chat.schemas.outbound import ChatRoomOut
from app.core.schemas.error import ErrorResponse
from app.core.schemas.outbound import APIResponse
from app.core.security import verify_service_key
from app.db.models.user import UserDB
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.item.repository import ItemRepository


chat_router = APIRouter(
    prefix="/api/chat",
    tags=["Chat"],
    dependencies=[Depends(verify_service_key)],
)


@chat_router.post("/room/item/{itemAlias}")
async def get_room_by_item(
    user: UserDB = Depends(resolve_firebase_session),
    item_id: UUID = Depends(resolve_room_alias),
    db: AsyncSession = Depends(get_db),
):
    buyer_id = user.id
    room_db = await ChatRoomRepository.room_by_item_and_buyer(
        db,
        item_id,
        buyer_id,
    )
    if not room_db:
        item_db = await ItemRepository.by_item(db, item_id)
        if not item_db:
            raise ErrorResponse(message="item not found")
        room_db = await ChatRoomRepository.create_room_with_status(
            db,
            ChatRoomInDB(
                item_id=item_id,
                buyer_id=buyer_id,
                seller_id=item_db.user.id,
            ),
        )
        if not room_db:
            raise ErrorResponse(message="failed to create room")

    room = ChatRoomOut.from_db(room_db, user.id)

    return APIResponse(data={"room": room})


@chat_router.get("/room/list")
async def get_rooms(
    query: Annotated[RoomsQuery, Query()],
    user: UserDB = Depends(resolve_firebase_session),
    db: AsyncSession = Depends(get_db),
):
    rooms_db = await ChatRoomRepository.rooms_paginated(db, query, user.id)

    rooms = [ChatRoomOut.from_db(r, user.id) for r in rooms_db]

    return APIResponse(data={"rooms": rooms})
