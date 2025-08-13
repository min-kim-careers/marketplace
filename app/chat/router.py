import asyncio
from fastapi import APIRouter, Depends, Path, WebSocket, WebSocketDisconnect
import httpx

from app.auth.firebase.dependencies import resolve_firebase_token
from app.core.schemas.error import ErrorResponse
from app.core.schemas.outbound import APIResponse
from app.db.models.user import UserDB


chat_router = APIRouter(prefix="/api/chat", tags=["Chat"])

SYNAPSE_URL = "http://synapse-service:8008"

active_connections = dict()


@chat_router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    # user: UserDB = Depends(resolve_firebase_token),
):

    user = "user_me"

    await websocket.accept()

    active_connections[websocket] = user
    print(f"User {user} connected.")

    since = "0"
    try:
        async with httpx.AsyncClient(timeout=None) as client:
            while True:
                done, pending = await asyncio.wait(
                    [
                        asyncio.create_task(websocket.receive_json()),
                        asyncio.create_task(
                            client.get(
                                f"{SYNAPSE_URL}/_matrix/client/r0/sync",
                                params={
                                    "since": since,
                                    "timeout": 30000,
                                },
                            )
                        ),
                    ],
                    return_when=asyncio.FIRST_COMPLETED,
                )

                for task in done:
                    result = task.result()

                    if isinstance(result, dict) and "room_id" in result:
                        room_id = result["room_id"]
                        body = result["body"]
                        await client.post(
                            f"{SYNAPSE_URL}/_matrix/client/r0/rooms/{room_id}/send/m.room.message",
                            json={"msgtype": "m.text", "body": body},
                        )

                    elif isinstance(result, httpx.Response):
                        data = result.json()
                        since = data.get("next_batch", since)
                        await websocket.send_json(data)
    except WebSocketDisconnect:
        print(f"Websocket disconnected: {user}")
        del active_connections[websocket]
