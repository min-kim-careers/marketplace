from app.auth.firebase.dependencies import resolve_firebase_query_token
from app.chat.websocket.handler import ChatHandler
from app.db.models.user import UserDB
from fastapi import APIRouter, Depends, WebSocket

chat_ws_router = APIRouter(prefix="/api/chat/ws")


@chat_ws_router.websocket("")
async def websocket(
    websocket: WebSocket,
    user: UserDB = Depends(resolve_firebase_query_token),
):
    await websocket.accept()

    handler = ChatHandler(websocket=websocket, user=user)

    await handler.run()
