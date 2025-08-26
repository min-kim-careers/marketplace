import asyncio
from contextlib import suppress
from typing import Any, Literal
from uuid import UUID

from app.auth.firebase.dependencies import resolve_firebase_query_token
from app.cache.stores import unread_count_store
from app.chat.dependencies.resolve_websocket import (
    resolve_websocket_connection,
)
from app.chat.schemas.outbound import ChatResponse, MessageOut, ResponseType
from app.chat.service import ChatService
from app.chat.websocket.handler import ChatHandler
from app.core import logger
from app.db.models.chat_room import ChatRoomDB
from app.db.models.user import UserDB
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect


chat_ws_router = APIRouter(prefix="/api/chat/ws")


@chat_ws_router.websocket("")
async def websocket(
    websocket: WebSocket,
    # result: dict = Depends(resolve_websocket_connection),
    user: UserDB = Depends(resolve_firebase_query_token),
):
    await websocket.accept()

    # room: ChatRoomDB = result["room"]
    # user: UserDB = result["user"]
    # peer: UserDB = result["peer"]

    # user_id = str(user.id)
    # peer_id = str(peer.id)
    # room_id = room.room_id

    access_token = await ChatService.access_token(user.chat_id)
    if not access_token:
        await websocket.close(code=1008, reason="failed to get access token")
        return
    
    logger.info(f"User {user.id} connected.")

    handler = ChatHandler(
        websocket=websocket,
        chat_id=user.chat_id,
        access_token=access_token,
    )

    # recv_task = asyncio.create_task(receiver())
    # send_task = asyncio.create_task(sender())

    # try:
    #     await asyncio.wait({recv_task, send_task}, return_when=asyncio.FIRST_COMPLETED)
    # finally:
    #     for t in (recv_task, send_task):
    #         with suppress(asyncio.CancelledError, WebSocketDisconnect):
    #             t.cancel()
    #     with suppress(Exception):
    #         await websocket.close()
