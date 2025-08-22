from typing import Optional

from pydantic import BaseModel
from app.auth.firebase.dependencies import resolve_firebase_query_token
from app.chat.repository import ChatRepository
from app.core.helpers import decode_slug
from app.db.models.chat_room import ChatRoomDB
from app.db.models.user import UserDB
from app.db.session import get_db


from fastapi import Depends, Query, WebSocket
from sqlalchemy.ext.asyncio import AsyncSession


async def resolve_websocket(
    websocket: WebSocket,
    room_id: str = Query(default=None, alias="roomId"),
    user: UserDB = Depends(resolve_firebase_query_token),
    db: AsyncSession = Depends(get_db),
) -> Optional[dict]:
    if not room_id:
        await websocket.close(code=1008, reason="room ID missing")
        return

    room = await ChatRepository.get_room_by_id(db, decode_slug(room_id))
    if not room:
        await websocket.close(code=1008, reason="chat room not found")
        return

    peer = None
    if user.id == room.user_1_id:
        peer = room.user_2
    elif user.id == room.user_2_id:
        peer = room.user_1

    if not peer:
        await websocket.close(code=1008, reason="invalid user")
        return

    return {
        "room": room,
        "user": user,
        "peer": peer,
    }
