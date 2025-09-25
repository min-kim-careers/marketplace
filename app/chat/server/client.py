from datetime import datetime, timezone
import json
from app.cache.cache import redis
from app.chat.repositories.chat_room import ChatRoomRepository
from app.chat.server.constants import CHAT_IDLE_KEY
from app.chat.server.helpers.broadcast_key import broadcast_key
from app.chat.server.helpers.broadcast_room import broadcast_room
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
from app.chat.server.cache import chat_cache


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
        self.idle_key = CHAT_IDLE_KEY

    def _add_task(self, coro):
        t = asyncio.create_task(coro)
        self.tasks.add(t)
        t.add_done_callback(self.tasks.discard)
        return t

    async def is_peer_active(self) -> bool:
        return self.peer is not None and await chat_cache.is_user_active(self.peer.id)

    async def is_peer_active_room(self) -> bool:
        return (
            self.room is not None
            and self.peer is not None
            and await chat_cache.is_user_active_room(self.room.id, self.peer.id)
        )

    async def _send_text(self, payload: ChatInternalText):
        if not payload.timestamp or not self.room:
            raise

        mine = UUID(payload.user_id) == self.user.id

        await self.send_message(
            ChatTextOut.from_internal(
                msg=payload,
                mine=mine,
            )
        )

        # handle peer
        if not mine:
            await broadcast_room(
                ChatInternalRead(
                    room_id=payload.room_id,
                    user_id=payload.user_id,
                )
            )

    async def _send_read(self, payload: ChatInternalRead):
        if UUID(payload.user_id) != self.user.id and self.room:
            now = datetime.now(timezone.utc)

            await self.send_message(ChatReadOut(last_read=now.isoformat()))

            updated = await ChatRoomRepository.update_last_read(
                self.db, self.user.id, self.room.id, now
            )
            if not updated:
                logger.error("failed to update last read")

            await chat_cache.remove_unread_room(self.user.id, self.room.id)

    async def _send_typing(self, payload: ChatInternalTyping):
        if UUID(payload.user_id) != self.user.id:
            await self.send_message(ChatTypingOut(typing=payload.typing))

    async def _process_payload(self, payload: dict[str, Any]):
        payload = ChatInternalAdapter.validate_python(payload)

        if isinstance(payload, ChatInternalText):
            await self._send_text(payload)

        elif isinstance(payload, ChatInternalRead):
            await self._send_read(payload)

        elif isinstance(payload, ChatInternalTyping):
            await self._send_typing(payload)

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
                logger.exception("handle payload error: %s", e)

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
            logger.exception("listener error: %s", e)
        finally:
            await self.psub.close()
            logger.info("room channel closed")

    async def send_message(self, payload: ChatPayloadOutType) -> bool:
        try:
            await self.conn.send_json(payload.model_dump(mode="json", by_alias=True))
        except Exception as e:
            logger.exception("send message error: %s", e)
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
        room_db = await ChatRoomRepository.room_by_id(self.db, room_id)
        if not room_db:
            raise Exception("room not found")

        await self._subscribe(broadcast_key(str(room_id)))
        self.room = room_db
        self._set_peer(room_db)
        await chat_cache.set_user_active_room(self.room.id, self.user.id)
        await self.send_message(ChatJoinedOut())

    # on room leave
    async def reset_state(self):
        if not self.room:
            raise Exception("room missing while resetting state")

        await self._unsubscribe(broadcast_key(str(self.room.id)))
        await chat_cache.set_user_inactive_room(self.room.id, self.user.id)
        self.room = None

    # on connect
    async def run(self):
        await chat_cache.set_user_active(self.user.id)

        # start background tasks
        if not self.tasks:
            self._add_task(self._run_listener())

        # send connected message to client
        await self.send_message(ChatConnectedOut())

    # on disconnect
    async def close(self):
        await chat_cache.set_user_inactive(self.user.id)

        # clean up background tasks
        for t in list(self.tasks):
            t.cancel()
        for t in list(self.tasks):
            try:
                await t
            except asyncio.CancelledError:
                pass

    def is_in_session(self) -> bool:
        return self.room is not None and self.peer is not None
