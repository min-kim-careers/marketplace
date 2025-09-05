import asyncio
from collections import defaultdict
from datetime import datetime
import time
from typing import List, Set
from uuid import UUID
from fastapi import WebSocket
from sqlalchemy.ext.asyncio import AsyncSession

from app.cache.redis import redis
from app.chat.server.helpers import pubsub_key
from app.chat.server.schemas.inbound import (
    ChatJoinIn,
    ChatPayloadIn,
    ChatRestoreIn,
    ChatTextIn,
)
from app.chat.server.schemas.outbound import (
    ChatConnectedOut,
    ChatJoinedOut,
    ChatPayloadOutType,
    ChatRestoreOut,
    ChatTextOut,
)
from app.chat.server.stream import ChatStream, StreamMessage
from app.chat.services.chat_message import ChatMessageService
from app.core import logger


class ChatClient:
    def __init__(
        self, conn: WebSocket, db: AsyncSession, user_id: UUID, session_id: UUID
    ) -> None:
        self.conn: WebSocket = conn
        self.db: AsyncSession = db
        self.session_id: UUID = session_id
        self.user_id: UUID = user_id
        self.room_id: UUID | None = None
        self._tasks: Set[asyncio.Task] = set()

        self.no_messages = False
        self.last_timestamp = datetime.now().isoformat()

    def reset(self):
        self.no_messages = False
        self.last_timestamp = datetime.now().isoformat()
        self.last_activity = time.time()

    def spawn(self, coro):
        t = asyncio.create_task(coro)
        self._tasks.add(t)
        t.add_done_callback(self._tasks.discard)
        return t

    async def send_message(self, payload: ChatPayloadOutType):
        try:
            await self.conn.send_json(payload.model_dump(by_alias=True))
            print("sent payload:", payload.model_dump())
        except Exception as e:
            logger.error("send message error:", e)

    async def run_message_listener(self):
        if self.room_id:
            pubsub = redis.pubsub()
            print("subscribing to:", pubsub_key(str(self.room_id)))
            await pubsub.subscribe(pubsub_key(str(self.room_id)))
            async for msg in pubsub.listen():
                try:
                    if msg["type"] == "message":
                        stream_msg = StreamMessage.model_validate_json(msg["data"])
                        if not stream_msg.timestamp:
                            logger.error("stream message missing timestamp")
                            continue
                        await self.send_message(
                            ChatTextOut.from_stream(stream_msg, str(self.user_id)),
                        )
                except Exception as e:
                    logger.error("room listener error:", e)
                    continue

    async def run_tasks(self):
        self.spawn(self.run_message_listener())

    async def end_tasks(self):
        for t in list(self._tasks):
            t.cancel()
        for t in list(self._tasks):
            try:
                await t
            except asyncio.CancelledError:
                pass


class ChatManager:
    def __init__(self) -> None:
        self.clients: dict[UUID, ChatClient] = defaultdict()
        self.rooms: dict[UUID, set[ChatClient]] = defaultdict(set)
        self.stream: ChatStream = ChatStream()

    async def connect(self, client: ChatClient):
        await client.conn.accept()
        self.clients[client.session_id] = client
        await client.run_tasks()
        await client.send_message(ChatConnectedOut(session_id=client.session_id))

    async def reconnect(self, conn: WebSocket, session_id: UUID):
        client = self.clients[session_id]
        client.conn = conn
        await client.conn.accept()

    async def soft_disconnect(self, client: ChatClient):
        await client.conn.close(1000, reason="idle timeout")
        await client.end_tasks()

    async def hard_disconnect(self, client: ChatClient):
        self.leave_room(client)
        del self.clients[client.session_id]
        await client.end_tasks()

    async def join_room(self, room_id: UUID, client: ChatClient):
        client.reset()
        client.room_id = room_id
        self.rooms[room_id].add(client)

    def leave_room(self, client: ChatClient):
        if client.room_id:
            self.rooms[client.room_id].remove(client)
            if not self.rooms[client.room_id]:
                del self.rooms[client.room_id]
            client.room_id = None
            client.reset()

    async def broadcast_message(self, content: str, client: ChatClient):
        await self.stream.enqueue_message(
            StreamMessage(
                room_id=str(client.room_id),
                user_id=str(client.user_id),
                content=content,
            )
        )

    async def get_previous(self, client: ChatClient) -> List[ChatTextOut]:
        if client.room_id and not client.no_messages:
            previous = await ChatMessageService.get_messages(
                client.db, client.room_id, client.user_id, client.last_timestamp
            )
            if previous:
                client.last_timestamp = previous[-1].timestamp
            else:
                client.no_messages = True
            return previous
        return []

    async def handle_payload(self, data: dict, client: ChatClient):
        try:
            payload = ChatPayloadIn.validate_python(data)

            if isinstance(payload, ChatJoinIn):
                await self.join_room(payload.room_id, client)
                previous = await self.get_previous(client)
                await client.send_message(ChatJoinedOut())
                await client.send_message(ChatRestoreOut(previous=previous))

            elif isinstance(payload, ChatRestoreIn):
                previous = await self.get_previous(client)
                await client.send_message(ChatRestoreOut(previous=previous))

            elif isinstance(payload, ChatTextIn):
                await self.broadcast_message(payload.content, client)

        except Exception as e:
            logger.error("handle_payload:", e)
