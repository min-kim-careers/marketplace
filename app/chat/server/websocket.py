from fastapi import APIRouter, WebSocket, WebSocketDisconnect


chat_server = APIRouter(prefix="/api/chat/ws")


@chat_server.websocket("")
async def websocket_endpoint(
    websocket: WebSocket,
    # user: UserDB = Depends(resolve_firebase_query_token),
):
    await websocket.accept()

    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"Received: {data}")

    except WebSocketDisconnect:
        await websocket.close()
    except Exception:
        await websocket.close()
