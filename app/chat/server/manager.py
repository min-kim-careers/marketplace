import asyncio
from collections import defaultdict
from typing import List, Set
from uuid import UUID
from fastapi import WebSocket
from sqlalchemy.ext.asyncio import AsyncSession

from app.cache.redis import redis
from app.chat.server.helpers import pubsub_key
from app.chat.server.schemas.inbound import (
    ChatJoinIn,
    ChatPayloadIn,
    ChatTextIn,
)
from app.chat.server.schemas.outbound import (
    ChatJoinOut,
    ChatPayloadOutType,
    ChatTextOut,
)
from app.chat.server.stream import ChatStream, StreamMessage
from app.chat.services.chat_message import ChatMessageService
from app.core import logger


class ChatClient:
    def __init__(self, conn: WebSocket, db: AsyncSession, user_id: UUID) -> None:
        self.conn = conn
        self.db = db
        self.user_id: UUID = user_id
        self.room_id: UUID | None = None
        self._tasks: Set[asyncio.Task] = set()

    def spawn(self, coro):
        t = asyncio.create_task(coro)
        self._tasks.add(t)
        t.add_done_callback(self._tasks.discard)
        return t

    async def close(self):
        for t in list(self._tasks):
            t.cancel()
        for t in list(self._tasks):
            try:
                await t
            except asyncio.CancelledError:
                pass
        # await self.conn.close()


class ChatManager:
    def __init__(self) -> None:
        self.clients: dict[UUID, ChatClient] = defaultdict()
        self.rooms: dict[UUID, set[ChatClient]] = defaultdict(set)
        self.stream = ChatStream()

    async def connect(self, client: ChatClient):
        await client.conn.accept()
        self.clients[client.user_id] = client

    async def disconnect(self, client: ChatClient):
        self.leave_room(client)
        del self.clients[client.user_id]
        await client.close()

    async def join_room(self, room_id: UUID, client: ChatClient):
        client.room_id = room_id
        self.rooms[room_id].add(client)
        client.spawn(self.room_listener(client))

    def leave_room(self, client: ChatClient):
        if client.room_id:
            self.rooms[client.room_id].remove(client)
            if not self.rooms[client.room_id]:
                del self.rooms[client.room_id]
            client.room_id = None

    async def send_message(self, payload: ChatPayloadOutType, conn: WebSocket):
        print("sent payload:", payload.model_dump())
        await conn.send_json(payload.model_dump(by_alias=True))

    async def get_history(self, client: ChatClient) -> List[ChatTextOut]:
        if client.room_id:
            limit = 0
            return await ChatMessageService.get_messages(
                client.db, client.room_id, client.user_id, limit
            )
        return []

    async def handle_payload(self, data: dict, client: ChatClient):
        try:
            payload = ChatPayloadIn.validate_python(data)

            if isinstance(payload, ChatJoinIn):
                await self.join_room(payload.room_id, client)
                history = await self.get_history(client)
                await self.send_message(ChatJoinOut(history=history), client.conn)
            elif isinstance(payload, ChatTextIn):
                await self.stream.enqueue_message(
                    StreamMessage(
                        room_id=str(client.room_id),
                        user_id=str(client.user_id),
                        content=payload.content,
                    )
                )
        except Exception as e:
            logger.error("handle_payload:", e)

    async def room_listener(self, client: ChatClient):
        if client.room_id:
            pubsub = redis.pubsub()
            print("subscribing to:", pubsub_key(str(client.room_id)))
            await pubsub.subscribe(pubsub_key(str(client.room_id)))
            async for msg in pubsub.listen():
                try:
                    if msg["type"] == "message":
                        stream_msg = StreamMessage.model_validate_json(msg["data"])
                        if not stream_msg.timestamp:
                            logger.error("stream message missing timestamp")
                            continue
                        await self.send_message(
                            ChatTextOut.from_stream(stream_msg, str(client.user_id)),
                            client.conn,
                        )
                except Exception as e:
                    logger.error("room listener error:", e)
                    continue
