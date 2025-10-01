from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from app.auth.firebase.dependencies import resolve_firebase_query_token
from app.chat.server.client import ChatClient
from app.core.logger import logger
from sqlalchemy.ext.asyncio import AsyncSession
from app.chat.server.manager import chat_manager

from app.db.models.user import UserDB
from app.db.session import get_db


chat_server = APIRouter(prefix="/api/chat/ws")


@chat_server.websocket("")
async def websocket_endpoint(
    conn: WebSocket,
    db: AsyncSession = Depends(get_db),
    user: UserDB = Depends(resolve_firebase_query_token),
):
    client = None
    try:
        await conn.accept()

        client = await chat_manager.connect(
            ChatClient(
                conn=conn,
                db=db,
                user=user,
            ),
        )

        while True:
            data = await conn.receive_json()
            await chat_manager.handle_payload(data, client)
    except WebSocketDisconnect:
        logger.info("websocket disconnected")
    except Exception:
        logger.exception("websocket error")
    finally:
        if client:
            await chat_manager.disconnect(client)
