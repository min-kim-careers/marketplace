import asyncio
from contextlib import suppress
from typing import Any, Literal
from uuid import UUID

from app.auth.firebase.dependencies import resolve_firebase_query_token
from app.chat.dependencies.resolve_matrix_room_id import resolve_synapse_room_id
from app.chat.schemas.outbound import ChatResponse, ResponseType
from app.chat.service import ChatService
from app.core import logger
from app.core.schemas.error import ErrorResponse
from app.db.models.user import UserDB
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect


chat_ws_router = APIRouter(prefix="/api/chat/ws")


@chat_ws_router.websocket("")
async def websocket(
    websocket: WebSocket,
    user: UserDB = Depends(resolve_firebase_query_token),
    matrix_room_id: str = Depends(resolve_synapse_room_id),
):
    async def send_response(type: ResponseType, data: Any):
        try:
            await websocket.send_json(
                ChatResponse(
                    type=type,
                    data=data,
                ).model_dump(by_alias=True),
            )
        except Exception as e:
            logger.info(f"failed to send response: {e}")

    await websocket.accept()

    access_token = await ChatService.get_access_token(user.id)
    if not access_token:
        await websocket.close(code=1008, reason="failed to get access token")
        return

    logger.info(f"User {user.id} connected.")

    history = await ChatService.fetch_room_history(access_token, matrix_room_id)
    if history:
        await send_response("history", history)

    sync_task = ws_task = since = None
    try:
        while True:
            sync_task = asyncio.create_task(ChatService.sync_data(access_token, since))
            ws_task = asyncio.create_task(websocket.receive_json())
            done, _ = await asyncio.wait(
                [sync_task, ws_task],
                return_when=asyncio.FIRST_COMPLETED,
            )

            if ws_task in done:
                message = ws_task.result()
                await ChatService.send_message(access_token, matrix_room_id, message)
                sync_task.cancel()
            else:
                data = sync_task.result()
                if data:
                    since = data.get("next_batch", since)
                    # logger.info(data)
                ws_task.cancel()
    except WebSocketDisconnect:
        pass
    finally:
        for task in (sync_task, ws_task):
            if task:
                task.cancel()
                with suppress(asyncio.CancelledError):
                    await task
