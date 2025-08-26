import asyncio
from typing import Any, Callable

from app.cache.stores import unread_count_store
from app.chat.schemas.outbound import ChatResponse, MessageOut, ResponseType
from app.chat.service import ChatService
from app.core import logger
from fastapi import WebSocket

from app.core.helpers import deep_get
from app.db.models.user import UserDB


class ChatHandler:
    def __init__(self, websocket: WebSocket, chat_id: str, access_token: str) -> None:
        self.websocket = websocket
        self.chat_id = chat_id
        self.access_token = access_token
        self.since = None

    async def handle_room(self, room_id: str):
        sync_data = await ChatService.sync_data(self.access_token, self.since)
        if not sync_data:
            return

        messages = deep_get(
            sync_data,
            [
                ("rooms", {}),
                ("join", {}),
                (room_id, {}),
                ("timeline", {}),
                ("events", []),
            ],
        )

        if messages:
            await self.send_response(
                "messages",
                [
                    MessageOut.parse_matrix_data(m, self.chat_id).model_dump(
                        by_alias=True
                    )
                    for m in messages
                    if m["type"] == "m.room.message"
                ],
            )

        self.since = sync_data.get("next_batch", self.since)

    async def send_response(self, type: ResponseType, data: Any):
        try:
            await self.websocket.send_json(
                ChatResponse(
                    type=type,
                    data=data,
                ).model_dump(by_alias=True),
            )
        except Exception as e:
            logger.error(f"failed to send response: {e}")

    async def receiver(self, access_token: str, room_id: str, peer_id: str):
        try:
            while True:
                msg = await self.websocket.receive_json()
                if await ChatService.send_message(access_token, room_id, msg):
                    unread_count_store.incr(peer_id)
        except Exception as e:
            logger.error(f"receiver task error: {e}")
            return

    async def sender(self, room_id: str):
        try:
            while True:
                await self.handle_room(room_id)
                await asyncio.sleep(0.01)
        except Exception as e:
            logger.error(f"sender task error: {e}")
            return

    async def run_handler(self):
        pass
