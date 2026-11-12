from datetime import datetime, timezone
import json
from app.cache.cache import redis
from app.chat.repositories.chat_room import ChatRoomRepository
from app.chat.schemas.outbound import ChatRoomOut
from app.chat.server.constants import CHAT_IDLE_KEY
from app.chat.server.helpers.broadcast_client import broadcast_client
from app.chat.server.helpers.client_broadcast_key import client_broadcast_key
from app.chat.server.helpers.room_broadcast_key import room_broadcast_key
from app.chat.server.helpers.broadcast_room import broadcast_room
from app.chat.server.schemas.outbound import (
    ChatClientOut,
    ChatConnectedOut,
    ChatJoinedOut,
    ChatPayloadOutType,
    ChatReadOut,
    ChatTextOut,
    ChatTypingOut,
)
from app.chat.server.schemas.internal import (
    ChatInternalAdapter,
    ChatInternalClient,
    ChatInternalRead,
    ChatInternalTyping,
)
from app.chat.server.schemas.internal import ChatInternalText
from app.core.logger import logger
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

        # for room only
        self.room_queue: asyncio.Queue[
            tuple[Literal["subscribe", "unsubscribe"], str]
        ] = asyncio.Queue()

    def _add_task(self, coro):
        t = asyncio.create_task(coro)
        self.tasks.add(t)
        t.add_done_callback(self.tasks.discard)
        return t

    async def _send_text(self, payload: ChatInternalText):
        if not payload.timestamp or not self.room or not self.peer:
            raise

        mine = UUID(payload.user_id) == self.user.id

        # send to all
        await self.send_message(
            ChatTextOut.from_internal(
                msg=payload,
                mine=mine,
            )
        )

        # send to peers only
        if not mine:
            await broadcast_room(
                ChatInternalRead(
                    room_id=payload.room_id,
                    user_id=payload.user_id,
                )
            )

        if mine:
            await broadcast_client(
                ChatInternalClient(
                    room_id=str(self.room.id),
                    user_id=str(self.peer.id),
                )
            )

    async def _send_read(self, payload: ChatInternalRead):
        if UUID(payload.user_id) == self.user.id and self.room:
            now = datetime.now(timezone.utc)

            await self.send_message(ChatReadOut(last_read=now.isoformat()))

            try:
                await ChatRoomRepository.update_last_read(
                    self.db, self.user.id, self.room.id, now
                )
            except Exception:
                logger.exception("error sending read message from client")

            await chat_cache.remove_unread_room(self.user.id, self.room.id)

    async def _send_typing(self, payload: ChatInternalTyping):
        if UUID(payload.user_id) == self.user.id:
            await self.send_message(ChatTypingOut(typing=payload.typing))

    async def _process_payload(self, payload: dict[str, Any]):
        payload = ChatInternalAdapter.validate_python(payload)

        if isinstance(payload, ChatInternalText):
            await self._send_text(payload)

        elif isinstance(payload, ChatInternalRead):
            await self._send_read(payload)

        elif isinstance(payload, ChatInternalTyping):
            await self._send_typing(payload)

    async def _room_listener(self):
        async def __handle_message(msg: dict):
            try:
                if msg["channel"] == CHAT_IDLE_KEY or msg["type"] != "message":
                    return

                payload = json.loads(msg["data"])
                await self._process_payload(payload)
            except Exception:
                logger.exception("error handling message in room listener")

        pubsub = redis.pubsub()
        try:
            await pubsub.subscribe(CHAT_IDLE_KEY)
            timeout = 0.5
            while True:
                try:
                    cmd, key = self.room_queue.get_nowait()
                except asyncio.QueueEmpty:
                    pass
                else:
                    if cmd == "subscribe":
                        await pubsub.unsubscribe(CHAT_IDLE_KEY)
                        await pubsub.subscribe(key)
                        logger.info("subscribed to: %s", key)
                    elif cmd == "unsubscribe":
                        await pubsub.unsubscribe(key)
                        await pubsub.subscribe(CHAT_IDLE_KEY)
                        logger.info("unsubscribed from: %s", key)

                msg = await pubsub.get_message(
                    ignore_subscribe_messages=False, timeout=timeout
                )
                if msg:
                    await __handle_message(msg)
        except Exception:
            logger.exception("error in client room listener")
        finally:
            await pubsub.close()

    async def _client_listener(self):
        async def __handle_message(msg: dict):
            try:
                # only send direct client message if client not in room
                if self.room or msg["type"] != "message":
                    return

                data = json.loads(msg["data"])
                payload = ChatInternalClient.model_validate(data)
                room_db = await ChatRoomRepository.room_by_id(
                    self.db, UUID(payload.room_id)
                )
                if room_db:
                    room = ChatRoomOut.from_db(room_db, self.user.id)
                    room.unread = True
                    await self.send_message(ChatClientOut(room=room))
            except Exception:
                logger.exception("error handling message in client listener")

        pubsub = redis.pubsub()
        try:
            await pubsub.subscribe(client_broadcast_key(str(self.user.id)))

            async for msg in pubsub.listen():
                await __handle_message(msg)

        except Exception:
            logger.exception("error in client listener")
        finally:
            await pubsub.close()

    async def send_message(self, payload: ChatPayloadOutType):
        try:
            await self.conn.send_json(payload.model_dump(mode="json", by_alias=True))
        except Exception:
            logger.exception("error sending message")
        print("sent:", payload)

    async def _subscribe(self, room_key: str):
        await self.room_queue.put(("subscribe", room_key))

    async def _unsubscribe(self, room_key: str):
        await self.room_queue.put(("unsubscribe", room_key))

    def _set_peer(self, room: ChatRoomDB):
        self.peer = room.seller if self.user.id == room.buyer_id else room.buyer

    # on room join
    async def init_state(self, room_id: UUID):
        try:
            room_db = await ChatRoomRepository.room_by_id(self.db, room_id)
            await self._subscribe(room_broadcast_key(str(room_id)))
            self.room = room_db
            self._set_peer(room_db)
            await chat_cache.set_user_active_room(self.room.id, self.user.id)
            await self.send_message(ChatJoinedOut())
        except Exception:
            logger.exception("error initialising client state")

    # on room leave
    async def reset_state(self):
        if not self.room:
            raise Exception("room missing while resetting state")

        await self._unsubscribe(room_broadcast_key(str(self.room.id)))
        await chat_cache.set_user_inactive_room(self.room.id, self.user.id)
        self.room = None

    # on connect
    async def run(self):
        await chat_cache.set_user_active(self.user.id)

        # start background tasks
        if not self.tasks:
            self._add_task(self._room_listener())
            self._add_task(self._client_listener())

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
