import asyncio
from contextlib import suppress
from typing import Any, Literal
from uuid import UUID

from app.auth.firebase.dependencies import resolve_firebase_query_token
from app.chat.dependencies.resolve_chat_room import resolve_chat_room
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
    user: UserDB = Depends(resolve_firebase_query_token),
    chat_room: ChatRoomDB = Depends(resolve_chat_room),
):
    await websocket.accept()

    access_token = await ChatService.access_token(user.id)
    if not access_token:
        await websocket.close(code=1008, reason="failed to get access token")
        return
    logger.info(f"User {user.id} connected.")
    chat_room_id = chat_room.room_id

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
                await ChatService.send_message(access_token, chat_room_id, msg)
        except Exception as e:
            logger.error(f'receiver task error: {e}')
            return

    async def sender():
        try:
            since = None
            while True:
                sync_data = await ChatService.sync_data(access_token, since)
                if sync_data:
                    await handle_sync_data(
                        sync_data,
                        chat_room_id,
                        user.chat_id,
                        send_response,
                    )
                    since = sync_data.get("next_batch", since)
                await asyncio.sleep(0.01)
        except Exception as e:
            logger.error(f'sender task error: {e}')
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
