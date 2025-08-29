from uuid import UUID
from fastapi import APIRouter, Depends

from app.auth.firebase.dependencies import resolve_firebase_session
from app.chat.dependencies.resolve_room_alias import resolve_room_alias
from app.chat.repository import ChatRepository
from app.chat.schemas.inbound import ChatRoomInDB
from app.chat.schemas.outbound import ChatRoomOut
from app.core.schemas.error import ErrorResponse
from app.core.schemas.outbound import APIResponse
from app.core.security import verify_service_key
from app.db.models.user import UserDB
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db


chat_router = APIRouter(
    prefix="/api/chat",
    tags=["Chat"],
    dependencies=[Depends(verify_service_key)],
)


@chat_router.post("/room/item/{itemAlias}")
async def get_room_as_buyer(
    buyer: UserDB = Depends(resolve_firebase_session),
    item_id: UUID = Depends(resolve_room_alias),
    db: AsyncSession = Depends(get_db),
):
    room_db = await ChatRepository.room_by_item_and_buyer(
        db,
        item_id,
        buyer.id,
    )
    if not room_db:
        room_db = await ChatRepository.create_room(
            db,
            ChatRoomInDB(
                item_id=item_id,
                buyer_id=buyer.id,
            ),
        )
        if not room_db:
            raise ErrorResponse(message="failed to create room")

    room = ChatRoomOut.from_db(room_db)

    return APIResponse(data={"room": room})


@chat_router.get("/rooms")
async def get_rooms(
    user: UserDB = Depends(resolve_firebase_session),
    db: AsyncSession = Depends(get_db),
):
    room_db = await ChatRepository.room_by_item_and_buyer(
        db,
        item_id,
        buyer.id,
    )
    if not room_db:
        room_db = await ChatRepository.create_room(
            db,
            ChatRoomInDB(
                item_id=item_id,
                buyer_id=buyer.id,
            ),
        )
        if not room_db:
            raise ErrorResponse(message="failed to create room")

    room = ChatRoomOut.from_db(room_db)

    return APIResponse(data={"room": room})
