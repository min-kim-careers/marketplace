from app.auth.firebase.dependencies import resolve_firebase_query_token
from app.chat.service import ChatService
from app.db.models.user import UserDB


from fastapi import APIRouter, Depends, Query, WebSocket, WebSocketDisconnect


import asyncio
from contextlib import suppress

chat_ws_router = APIRouter(prefix="/api/chat/ws")


@chat_ws_router.websocket("")
async def websocket(
    websocket: WebSocket,
    user: UserDB = Depends(resolve_firebase_query_token),
    room_id: str = Query(default=None, alias="roomId"),
):
    await websocket.accept()

    # if room_id not in

    access_token = await ChatService.get_access_token(str(user.id), str(user.id))
    print(f"User {user} connected.")
    since = None

    sync_task = ws_task = None

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
                await ChatService.send_message(access_token, "room_id", message)
                sync_task.cancel()
            else:
                data = sync_task.result()
                if data:
                    since = data.get("next_batch", since)
                    await websocket.send_json(data)
                ws_task.cancel()
    except WebSocketDisconnect:
        pass
    finally:
        for task in (sync_task, ws_task):
            if task:
                task.cancel()
                with suppress(asyncio.CancelledError):
                    await task
