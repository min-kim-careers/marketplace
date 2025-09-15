from app.cache.redis import redis
from app.chat.repositories.chat_room import ChatRoomRepository
from app.chat.server.helpers import pubsub_key
from app.chat.server.schemas.outbound import ChatPayloadOutType, ChatTextOut
from app.chat.server.stream import StreamMessage
from app.core import logger


from fastapi import WebSocket
from sqlalchemy.ext.asyncio import AsyncSession


import asyncio
from typing import Literal, Optional, Set
from uuid import UUID

from app.db.models.chat_room import ChatRoomDB


class ChatClient:
    def __init__(self, conn: WebSocket, db: AsyncSession, user_id: UUID) -> None:
        self.conn: WebSocket = conn
        self.db: AsyncSession = db
        self.user_id: UUID = user_id
        self.room: Optional[ChatRoomDB] = None
        self.tasks: Set[asyncio.Task] = set()

        # listener
        self.cmd_q: asyncio.Queue[tuple[Literal["subscribe", "unsubscribe"], str]] = (
            asyncio.Queue()
        )
        self.psub = redis.pubsub()
        self.idle_key = b"__idle__"

    # must subscribe to idle key on init
    async def _set_idle(self):
        await self.psub.subscribe(self.idle_key)

    def _add_task(self, coro):
        t = asyncio.create_task(coro)
        self.tasks.add(t)
        t.add_done_callback(self.tasks.discard)
        return t

    async def _handle_message(self, msg):
        try:
            if msg["channel"] == self.idle_key:
                return

            # send message to client
            elif msg["type"] == "message":
                stream_msg = StreamMessage.model_validate_json(msg["data"])
                if not stream_msg.timestamp:
                    logger.error("stream message missing timestamp")
                    return

                await self.send_message(
                    ChatTextOut.from_stream(stream_msg, str(self.user_id)),
                )
        except Exception as e:
            logger.error("handle message error:", e)

    async def run_listener(self):
        try:
            await self._set_idle()
            timeout = 0.5
            while True:
                try:
                    cmd, key = self.cmd_q.get_nowait()
                except asyncio.QueueEmpty:
                    pass
                else:
                    if cmd == "subscribe":
                        await self.psub.subscribe(key)
                        print("subscribed:", key)
                    elif cmd == "unsubscribe":
                        await self.psub.unsubscribe(key)
                        await self._set_idle()
                        print("unsubscribed:", key)

                msg = await self.psub.get_message(
                    ignore_subscribe_messages=False, timeout=timeout
                )
                if msg:
                    await self._handle_message(msg)
        except Exception as e:
            logger.error("listener error:", e)
        finally:
            await self.psub.close()
            print("room channel closed")

    async def reset_state(self):
        await self.end_tasks()

    async def send_message(self, payload: ChatPayloadOutType):
        try:
            await self.conn.send_json(payload.model_dump(by_alias=True))
            print("sent payload:", payload.model_dump())
        except Exception as e:
            logger.error("send message error:", e)

    async def subscribe(self, room_key: str):
        await self.cmd_q.put(("subscribe", room_key))

    async def unsubscribe(self, room_key: str):
        await self.cmd_q.put(("unsubscribe", room_key))

    async def set_room(self, room_id: UUID) -> bool:
        room = await ChatRoomRepository.room_by_id(self.db, room_id)
        if not room:
            return False
        await self.subscribe(pubsub_key(str(room_id)))
        self.room = room
        return True

    async def unset_room(self):
        if self.room:
            await self.unsubscribe(pubsub_key(str(self.room.id)))
            self.room = None

    def run_tasks(self):
        if not self.tasks:
            self._add_task(self.run_listener())

    async def end_tasks(self):
        for t in list(self.tasks):
            t.cancel()
        for t in list(self.tasks):
            try:
                await t
            except asyncio.CancelledError:
                pass
