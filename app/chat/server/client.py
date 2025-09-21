from datetime import datetime, timezone
import json
from app.cache.cache import redis
from app.chat.repositories.chat_room import ChatRoomRepository
from app.chat.server.helpers import broadcast_key
from app.chat.server.schemas.outbound import (
    ChatConnectedOut,
    ChatJoinedOut,
    ChatPayloadOutType,
    ChatReadOut,
    ChatTextOut,
    ChatTypingOut,
)
from app.chat.server.schemas.internal import (
    ChatInternalAdapter,
    ChatInternalRead,
    ChatInternalTyping,
)
from app.chat.server.schemas.internal import ChatInternalText
from app.core import logger
from app.chat.server.status import status_manager
from app.chat.server.stream import stream_manager


from fastapi import WebSocket
from sqlalchemy.ext.asyncio import AsyncSession


import asyncio
from typing import Any, Literal, Optional, Set
from uuid import UUID

from app.db.models.chat_room import ChatRoomDB
from app.db.models.user import UserDB


class ChatClient:
    def __init__(self, conn: WebSocket, db: AsyncSession, user: UserDB) -> None:
        self.conn: WebSocket = conn
        self.db: AsyncSession = db
        self.user: UserDB = user
        self.room: Optional[ChatRoomDB] = None
        self.peer: Optional[UserDB] = None

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

    async def peer_is_active(self) -> bool:
        return (
            bool(self.room)
            and bool(self.peer)
            and await status_manager.user_is_active(self.room.id, self.peer.id)
        )

    async def _handle_text(self, payload: ChatInternalText):
        if not payload.timestamp or not self.room:
            raise Exception("handle text error")

        mine = UUID(payload.user_id) == self.user.id

        await self.send_message(
            ChatTextOut.from_internal(
                msg=payload,
                mine=mine,
            )
        )

        await status_manager.set_last_read(
            self.room.id, self.user.id, datetime.now(timezone.utc)
        )
        if not mine:
            await stream_manager.stream_read(
                ChatInternalRead(
                    room_id=str(self.room.id),
                    user_id=str(self.user.id),
                )
            )

    async def _handle_read(self, payload: ChatInternalRead):
        # send if message not from client (from peer)
        if self.room and self.peer and UUID(payload.user_id) != self.user.id:
            last_read = await status_manager.get_last_read(self.room.id, self.peer.id)
            if not last_read:
                raise Exception("client error handling last read")
            await self.send_message(ChatReadOut(last_read=last_read.isoformat()))

    async def _handle_typing(self, payload: ChatInternalTyping):
        # send if message not from client (from peer)
        if UUID(payload.user_id) != self.user.id:
            await self.send_message(ChatTypingOut(typing=payload.typing))

    async def _process_payload(self, payload: dict[str, Any]):
        payload = ChatInternalAdapter.validate_python(payload)

        if isinstance(payload, ChatInternalText):
            await self._handle_text(payload)

        elif isinstance(payload, ChatInternalRead):
            await self._handle_read(payload)

        elif isinstance(payload, ChatInternalTyping):
            await self._handle_typing(payload)

    async def _run_listener(self):
        async def _handle_data(data: dict):
            try:
                # skip if listening to __idle__ channel
                if data["channel"] == self.idle_key:
                    return
                # send message to client
                elif data["type"] == "message":
                    payload = json.loads(data["data"])
                    await self._process_payload(payload)
            except Exception as e:
                logger.error("handle payload error:", e)

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
                    await _handle_data(msg)
        except Exception as e:
            logger.error("listener error:", e)
        finally:
            await self.psub.close()
            logger.info("room channel closed")

    async def send_message(self, payload: ChatPayloadOutType) -> bool:
        try:
            await self.conn.send_json(payload.model_dump(mode="json", by_alias=True))
        except Exception as e:
            logger.error("send message error:", e)
            return False
        print("sent:", payload)
        return True

    async def _subscribe(self, room_key: str):
        await self.cmd_q.put(("subscribe", room_key))

    async def _unsubscribe(self, room_key: str):
        await self.cmd_q.put(("unsubscribe", room_key))

    def _set_peer(self, room: ChatRoomDB):
        self.peer = room.seller if self.user.id == room.buyer_id else room.buyer

    # on room join
    async def init_state(self, room_id: UUID):
        # set room
        room = await ChatRoomRepository.room_by_id(self.db, room_id)
        if not room:
            raise Exception("room not found")

        await self._subscribe(broadcast_key(str(room_id)))
        self.room = room
        self._set_peer(room)
        await status_manager.set_user_active(self.room.id, self.user.id)
        await status_manager.update_last_read(self.db, self.room.id, self.user.id)
        await self.send_message(ChatJoinedOut())

    # on room leave
    async def reset_state(self):
        if not self.room:
            raise Exception("room missing while resetting state")

        await self._unsubscribe(broadcast_key(str(self.room.id)))
        await status_manager.set_user_inactive(self.room.id, self.user.id)
        self.room = None

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
