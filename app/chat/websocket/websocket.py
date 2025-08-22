import asyncio
from contextlib import suppress
from typing import Any, Literal
from uuid import UUID

from app.auth.firebase.dependencies import resolve_firebase_query_token
from app.cache.stores import unread_count_store
from app.chat.dependencies.resolve_websocket import (
    resolve_websocket,
)
from app.chat.schemas.outbound import ChatResponse, MessageOut, ResponseType
from app.chat.service import ChatService
from app.chat.websocket.handlers import handle_sync_data
from app.core import logger
from app.db.models.chat_room import ChatRoomDB
from app.db.models.user import UserDB
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect


chat_ws_router = APIRouter(prefix="/api/chat/ws")


@chat_ws_router.websocket("")
async def websocket(
    websocket: WebSocket,
    result: dict = Depends(resolve_websocket),
):
    await websocket.accept()

    room: ChatRoomDB = result["room"]
    user: UserDB = result["user"]
    peer: UserDB = result["peer"]

    user_id = str(user.id)
    peer_id = str(peer.id)
    room_id = room.room_id

    access_token = await ChatService.access_token(user_id)
    if not access_token:
        await websocket.close(code=1008, reason="failed to get access token")
        return
    logger.info(f"User {user_id} connected.")

    async def send_response(type: ResponseType, data: Any):
        try:
            await websocket.send_json(
                ChatResponse(
                    type=type,
                    data=data,
                ).model_dump(by_alias=True),
            )
        except Exception as e:
            logger.error(f"failed to send response: {e}")

    async def receiver():
        try:
            while True:
                msg = await websocket.receive_json()
                r = await ChatService.send_message(access_token, peer_id, msg)
                if r:
                    unread_count_store.incr(peer_id)
        except Exception as e:
            logger.error(f"receiver task error: {e}")
            return

    async def sender():
        try:
            since = None
            while True:
                sync_data = await ChatService.sync_data(access_token, since)
                if sync_data:
                    await handle_sync_data(
                        sync_data,
                        room_id,
                        user.chat_user_id,
                        send_response,
                    )
                    since = sync_data.get("next_batch", since)
                await asyncio.sleep(0.01)
        except Exception as e:
            logger.error(f"sender task error: {e}")
            return

    recv_task = asyncio.create_task(receiver())
    send_task = asyncio.create_task(sender())

    try:
        await asyncio.wait({recv_task, send_task}, return_when=asyncio.FIRST_COMPLETED)
    finally:
        for t in (recv_task, send_task):
            with suppress(asyncio.CancelledError, WebSocketDisconnect):
                t.cancel()
        with suppress(Exception):
            await websocket.close()
