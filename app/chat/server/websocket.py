from typing import Optional
from uuid import UUID, uuid4
from fastapi import APIRouter, Depends, Query, WebSocket, WebSocketDisconnect
from app.auth.firebase.dependencies import resolve_firebase_query_token
from app.chat.server.manager import ChatClient
from app.core import logger
from app.chat.server.manager import ChatManager
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.user import UserDB
from app.db.session import get_db


chat_server = APIRouter(prefix="/api/chat/ws")

manager = ChatManager()


@chat_server.websocket("")
async def websocket_endpoint(
    conn: WebSocket,
    db: AsyncSession = Depends(get_db),
    user: UserDB = Depends(resolve_firebase_query_token),
    session_id: Optional[UUID] = Query(None, alias="sessionId"),
):
    client = None
    try:
        if session_id:
            client = manager.clients[session_id]
            await manager.reconnect(conn, session_id)
        else:
            client = ChatClient(conn, db, user.id, uuid4())
            await manager.connect(client)

        while True:
            data = await conn.receive_json()
            await manager.handle_payload(data, client)
    except WebSocketDisconnect as e:
        logger.info("websocket disconnected")
    except Exception as e:
        # logger.error("websocket error:", e)
        pass
    finally:
        if client:
            await manager.hard_disconnect(client)
