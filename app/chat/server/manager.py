from collections import defaultdict
from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from app.chat.server.client import ChatClient
from app.chat.server.schemas.inbound import (
    ChatJoinIn,
    ChatPayloadIn,
    ChatRestoreIn,
    ChatTextIn,
)
from app.chat.server.schemas.outbound import (
    ChatJoinedOut,
    ChatRestoreOut,
)
from app.chat.server.stream import ChatStreamer, ChatStreamText
from app.chat.services.chat_message import ChatMessageService
from app.core import logger


class ChatManager:
    def __init__(self) -> None:
        self.rooms: dict[UUID, set[ChatClient]] = defaultdict(set)
        self.stream: ChatStreamer = ChatStreamer()
        self.peer_last_read_at: Optional[datetime] = None

    async def connect(self, client: ChatClient):
        print("connecting...")
        await client.conn.accept()
        await client.run()
        return client

    async def disconnect(self, client: ChatClient):
        print("disconnecting...")
        await self._handle_leave(client)
        await client.close()

    async def _handle_join(self, room_id: UUID, client: ChatClient):
        try:
            if await client.init_state(room_id):
                self.rooms[room_id].add(client)
                peer_status = await client.get_peer_status()
                if not peer_status:
                    raise Exception("failed to get peer status")
                await client.send_message(
                    ChatJoinedOut(peer_last_read=peer_status.last_read)
                )
        except Exception as e:
            logger.error("error joining room:", e)

    async def _handle_leave(self, client: ChatClient):
        try:
            if client.room:
                self.rooms[client.room.id].remove(client)
                await client.reset_state()
                if not self.rooms[client.room.id]:
                    del self.rooms[client.room.id]
        except Exception as e:
            logger.error("error leaving room:", e)

    async def _handle_restore(self, client: ChatClient, since: str):
        if not client.room:
            return []
        previous = await ChatMessageService.get_messages(
            client.db,
            client.room.id,
            client.user_id,
            since,
        )

        # read logic here ---------------
        # mark restored messages as read depending on peer status
        for m in previous:
            pass

        now = datetime.now(timezone.utc)
        # update user status
        # -------------------------------

        await client.send_message(ChatRestoreOut(previous=previous))

    async def _handle_broadcast(self, content: str, client: ChatClient):
        try:
            if client.room:
                await self.stream.enqueue_text(
                    ChatStreamText(
                        room_id=str(client.room.id),
                        user_id=str(client.user_id),
                        content=content,
                    )
                )
        except Exception as e:
            logger.error("broadcast error:", e)

    async def handle_payload(self, payload: dict, client: ChatClient):
        try:
            payload = ChatPayloadIn.validate_python(payload)

            if isinstance(payload, ChatJoinIn):
                await self._handle_join(payload.room_id, client)

            elif isinstance(payload, ChatRestoreIn):
                await self._handle_restore(client, payload.since)

            elif isinstance(payload, ChatTextIn):
                await self._handle_broadcast(payload.content, client)

        except Exception as e:
            logger.error("handle payload error:", e)
