import asyncio
from collections import defaultdict
from typing import List, Literal, Optional, Set
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
    def __init__(self, conn: WebSocket, db: AsyncSession, user_id: UUID) -> None:
        self.conn: WebSocket = conn
        self.db: AsyncSession = db
        self.user_id: UUID = user_id
        self.room_id: Optional[UUID] = None
        self.tasks: Set[asyncio.Task] = set()

        # listener
        self.cmd_q: asyncio.Queue[tuple[Literal["subscribe", "unsubscribe"], str]] = (
            asyncio.Queue()
        )
        self.idle_key = b"__idle__"

    async def subscribe(self, room_key: str):
        await self.cmd_q.put(("subscribe", room_key))

    async def unsubscribe(self, room_key: str):
        await self.cmd_q.put(("unsubscribe", room_key))

    async def run_listener(self):
        async def set_idle():
            await pubsub.subscribe(self.idle_key)
            print("idling..")

        async def handle_message(msg):
            try:
                if msg["channel"] == self.idle_key:
                    return

                elif msg["type"] == "message":
                    stream_msg = StreamMessage.model_validate_json(msg["data"])
                    if not stream_msg.timestamp:
                        logger.error("stream message missing timestamp")
                        return
                    await self.send_text(
                        ChatTextOut.from_stream(stream_msg, str(self.user_id)),
                    )
            except Exception as e:
                logger.error("room listener error:", e)

        pubsub = redis.pubsub()
        await set_idle()
        timeout = 0.5
        try:
            while True:
                try:
                    cmd, key = self.cmd_q.get_nowait()
                except asyncio.QueueEmpty:
                    pass
                else:
                    if cmd == "subscribe":
                        await pubsub.subscribe(key)
                        print("subscribed:", key)
                    elif cmd == "unsubscribe":
                        await pubsub.unsubscribe(key)
                        await set_idle()
                        print("unsubscribed:", key)

                msg = await pubsub.get_message(
                    ignore_subscribe_messages=False, timeout=timeout
                )
                if msg:
                    await handle_message(msg)
        except Exception as e:
            logger.error("listener error:", e)
        finally:
            await pubsub.close()
            print("channel closed")

    async def reset_state(self):
        await self.end_tasks()

    def spawn(self, coro):
        t = asyncio.create_task(coro)
        self.tasks.add(t)
        t.add_done_callback(self.tasks.discard)
        return t

    async def send_text(self, payload: ChatPayloadOutType):
        try:
            await self.conn.send_json(payload.model_dump(by_alias=True))
            print("sent payload:", payload.model_dump())
        except Exception as e:
            logger.error("send message error:", e)

    async def set_room(self, room_id: UUID):
        await self.subscribe(pubsub_key(str(room_id)))
        self.room_id = room_id

    async def unset_room(self, room_id: UUID):
        await self.unsubscribe(pubsub_key(str(room_id)))
        self.room_id = None

    def run_tasks(self):
        if not self.tasks:
            self.spawn(self.run_listener())

    async def end_tasks(self):
        for t in list(self.tasks):
            t.cancel()
        for t in list(self.tasks):
            try:
                await t
            except asyncio.CancelledError:
                pass


class ChatManager:
    def __init__(self) -> None:
        self.rooms: dict[UUID, set[ChatClient]] = defaultdict(set)
        self.stream: ChatStream = ChatStream()

    async def connect(self, client: ChatClient):
        print("connecting...")
        await client.conn.accept()
        client.run_tasks()
        await client.send_text(ChatConnectedOut())
        return client

    async def disconnect(self, client: ChatClient):
        print("disconnecting...")
        await self.leave_room(client)
        await client.end_tasks()

    async def join_room(self, room_id: UUID, client: ChatClient):
        await client.set_room(room_id)
        self.rooms[room_id].add(client)

    async def leave_room(self, client: ChatClient):
        if client.room_id:
            self.rooms[client.room_id].remove(client)
            if not self.rooms[client.room_id]:
                del self.rooms[client.room_id]
            await client.unset_room(client.room_id)
            await client.reset_state()

    async def broadcast_message(self, content: str, client: ChatClient):
        await self.stream.enqueue_message(
            StreamMessage(
                room_id=str(client.room_id),
                user_id=str(client.user_id),
                content=content,
            )
        )

    async def get_previous(self, client: ChatClient, since: str) -> List[ChatTextOut]:
        if client.room_id:
            return await ChatMessageService.get_messages(
                client.db, client.room_id, client.user_id, since
            )
        return []

    async def handle_payload(self, data: dict, client: ChatClient):
        try:
            payload = ChatPayloadIn.validate_python(data)

            if isinstance(payload, ChatJoinIn):
                await self.join_room(payload.room_id, client)
                await client.send_text(ChatJoinedOut())

            elif isinstance(payload, ChatRestoreIn):
                previous = await self.get_previous(client, payload.since)
                await client.send_text(ChatRestoreOut(previous=previous))

            elif isinstance(payload, ChatTextIn):
                await self.broadcast_message(payload.content, client)

        except Exception as e:
            logger.error("handle_payload:", e)
