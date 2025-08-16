from app.chat.repository import ChatRepository
from app.core.utils import decode_slug
from app.db.session import get_db


from fastapi import Depends, Query, WebSocket
from sqlalchemy.ext.asyncio import AsyncSession


async def resolve_synapse_room_id(
    websocket: WebSocket,
    room_id: str = Query(default=None, alias="roomId"),
    db: AsyncSession = Depends(get_db),
):
    if not room_id:
        await websocket.close(code=1008, reason="room ID missing")
        return
    _room_id = decode_slug(room_id)
    chat_room = await ChatRepository.get_room_by_id(db, _room_id)
    if not chat_room:
        await websocket.close(code=1008, reason="chat room not found")
        return
    return chat_room.room_id