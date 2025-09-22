from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from app.auth.firebase.dependencies import resolve_firebase_query_token
from app.chat.server.client import ChatClient
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
):
    try:
        await conn.accept()
        logger.info("Connection accepted")

        client = await manager.connect(
            ChatClient(
                conn=conn,
                db=db,
                user=user,
            ),
        )

        while True:
            data = await conn.receive_json()
            await manager.handle_payload(data, client)
    except WebSocketDisconnect as e:
        logger.info("websocket disconnected")
    except Exception as e:
        logger.exception("websocket error: %s", e)
    finally:
        if client:
            await manager.disconnect(client)
