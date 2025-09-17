from app.cache.redis import redis
from app.chat.repositories.chat_room import ChatRoomRepository
from app.chat.server.helpers import broadcast_key
from app.chat.server.schemas.outbound import (
    ChatConnectedOut,
    ChatPayloadOutType,
    ChatReadOut,
    ChatTextOut,
)
from app.chat.server.stream import ChatStream, ChatStreamRead, ChatStreamText
from app.core import logger


from fastapi import WebSocket
from sqlalchemy.ext.asyncio import AsyncSession


import asyncio
from typing import Any, Literal, Optional, Set
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

    def _add_task(self, coro):
        t = asyncio.create_task(coro)
        self.tasks.add(t)
        t.add_done_callback(self.tasks.discard)
        return t

    def _get_peer_id(self):
        if self.room:
            return (
                self.room.seller_id
                if self.user_id == self.room.buyer_id
                else self.room.buyer_id
            )

    async def get_peer_status(self):
        if self.room:
            peer_id = self._get_peer_id()
            if not peer_id:
                logger.error("failed to get peer status: no peer id")
                return
            return await ChatRoomRepository.status_by_user(
                self.db,
                user_id=peer_id,
                room_id=self.room.id,
            )

    def _handle_text(self, stream: ChatStreamText):
        if not stream.timestamp:
            logger.error("stream message missing timestamp")
            return

        return ChatTextOut.from_stream(
            msg=stream,
            user_id=str(self.user_id),
        )

    def _handle_read(self, stream: ChatStreamRead):
        if stream.user_id == self.user_id:
            return ChatReadOut(last_read_at=stream.last_read_at)

    async def _process_data(self, data: dict[str, Any]):
        stream = ChatStream.validate_python(data)

        message = None

        if isinstance(stream, ChatStreamText):
            message = self._handle_text(stream)

        elif isinstance(stream, ChatStreamRead):
            message = self._handle_read(stream)

        if message:
            await self.send_message(message)

    async def _handle_payload(self, payload: dict[str, Any]):
        try:
            # skip if listening to __idle__ channel
            if payload["channel"] == self.idle_key:
                return
            # send message to client
            elif payload["type"] == "message":
                await self._process_data(payload["data"])
        except Exception as e:
            logger.error("handle message error:", e)

    async def _run_listener(self):
        # must subscribe to idle key on init
        async def _set_idle():
            await self.psub.subscribe(self.idle_key)

        try:
            await _set_idle()
            timeout = 0.5
            while True:
                try:
                    cmd, key = self.cmd_q.get_nowait()
                except asyncio.QueueEmpty:
                    pass
                else:
                    if cmd == "subscribe":
                        await self.psub.subscribe(key)
                        logger.info("subscribed:", key)
                    elif cmd == "unsubscribe":
                        await self.psub.unsubscribe(key)
                        await _set_idle()
                        logger.info("unsubscribed:", key)

                msg = await self.psub.get_message(
                    ignore_subscribe_messages=False, timeout=timeout
                )
                if msg:
                    await self._handle_payload(msg)
        except Exception as e:
            logger.error("listener error:", e)
        finally:
            await self.psub.close()
            logger.info("room channel closed")

    async def send_message(self, payload: ChatPayloadOutType) -> bool:
        try:
            await self.conn.send_json(payload.model_dump(mode="json", by_alias=True))
            logger.info("sent payload:", payload.model_dump())
        except Exception as e:
            logger.error("send message error:", e)
            return False
        return True

    async def _subscribe(self, room_key: str):
        await self.cmd_q.put(("subscribe", room_key))

    async def _unsubscribe(self, room_key: str):
        await self.cmd_q.put(("unsubscribe", room_key))

    # on room join
    async def init_state(self, room_id: UUID) -> bool:
        # set room
        room = await ChatRoomRepository.room_by_id(self.db, room_id)
        if not room:
            logger.error("room not found")
            return False

        # queue channel subscription
        await self._subscribe(broadcast_key(str(room_id)))
        self.room = room
        return True

    async def _unset_room(self):
        if self.room:
            await self._unsubscribe(broadcast_key(str(self.room.id)))
            self.room = None

    # on room leave
    async def reset_state(self):
        await asyncio.gather(
            self._unset_room(),
        )

    # on connect
    async def run(self):
        # start background tasks
        if not self.tasks:
            self._add_task(self._run_listener())

        # send connected message to client
        await self.send_message(ChatConnectedOut())

    # on disconnect
    async def close(self):
        # clean up background tasks
        for t in list(self.tasks):
            t.cancel()
        for t in list(self.tasks):
            try:
                await t
            except asyncio.CancelledError:
                pass
