import asyncio
from contextlib import suppress
from typing import Any

from app.cache.stores import message_store
from app.chat.schemas.inbound import ChatMessageIn
from app.chat.schemas.outbound import ChatMessageOut, ChatResponse, ResponseType
from app.chat.service import ChatService
from app.core import logger
from app.core.helpers import deep_get
from app.db.models.user import UserDB
from fastapi import WebSocket, WebSocketDisconnect


class ChatHandler:
    def __init__(self, websocket: WebSocket, user: UserDB) -> None:
        self.websocket = websocket
        self.user = user
        self.chat_id = user.chat_id
        self.since = None
        self.rooms: dict[str, str] = {"room_id": "peer_id"}
        self.message_store = message_store

    async def handle_room(self, room_id: str, room: dict):
        def extract_events(room: dict):
            return deep_get(room, [("timeline", {}), ("events", [])])

        def extract_text_messages(events: list[dict]):
            text_messages = []
            for e in events:
                if e["type"] == "m.room.message":
                    text_messages += [
                        ChatMessageOut.from_server(e, self.chat_id, room_id).model_dump(
                            by_alias=True
                        )
                    ]
            return text_messages

        events = extract_events(room)
        if events:
            msgs = extract_text_messages(events)
            is_active_room = room_id in self.rooms
            if is_active_room:
                await self.send_response("messages", msgs)
            else:
                pass

    async def handle_sync_data(self, access_token: str):
        def extract_rooms(sync_data: dict):
            return deep_get(
                sync_data,
                [("rooms", {}), ("join", {})],
            )

        sync_data = await ChatService.sync_data(access_token, self.since)
        if sync_data:
            rooms: dict = extract_rooms(sync_data)
            for room_id, room in rooms.items():
                await self.handle_room(room_id, room)

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

    # to server
    async def receiver(self, access_token: str):
        try:
            while True:
                data = await self.websocket.receive_json()
                msg = ChatMessageIn.model_validate(data)
                if await ChatService.send_message(
                    access_token, msg.room_id, msg.content
                ):
                    pass
        except Exception as e:
            logger.error(f"receiver task error: {e}")
            return

    # to client
    async def sender(self, access_token: str):
        try:
            while True:
                try:
                    await self.handle_sync_data(access_token)
                finally:
                    await asyncio.sleep(0.01)
        except Exception as e:
            logger.error(f"sender task error: {e}")
            return

    async def run(self):
        access_token = await ChatService.access_token(str(self.user.id))
        if not access_token:
            await self.websocket.close(code=1008, reason="failed to get access token")
            return

        logger.info(f"User {self.user.id} connected.")

        recv_task = asyncio.create_task(self.receiver(access_token))
        send_task = asyncio.create_task(self.sender(access_token))

        try:
            await asyncio.wait(
                {recv_task, send_task}, return_when=asyncio.FIRST_COMPLETED
            )
        finally:
            for t in (recv_task, send_task):
                with suppress(asyncio.CancelledError, WebSocketDisconnect):
                    t.cancel()
            with suppress(Exception):
                await self.websocket.close()
