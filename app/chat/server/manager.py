from datetime import datetime, timezone

from app.chat.server.client import ChatClient
from app.chat.server.schemas.inbound import (
    ChatJoinIn,
    ChatPayloadIn,
    ChatRestoreIn,
    ChatTextIn,
)
from app.chat.server.schemas.outbound import (
    ChatRestoredOut,
    ChatTextOut,
)
from app.chat.server.stream.schemas import ChatStreamRead, ChatStreamText
from app.chat.services.chat_message import ChatMessageService
from app.core import logger
from app.chat.server.status import status_manager
from app.chat.server.stream import stream_manager


class ChatManager:
    async def connect(self, client: ChatClient):
        print("connecting...")
        await client.conn.accept()
        await client.run()
        return client

    async def disconnect(self, client: ChatClient):
        print("disconnecting...")
        await self._handle_leave(client)
        await client.close()

    async def _handle_join(self, client: ChatClient, payload: ChatJoinIn):
        print("joining...")
        try:
            await client.init_state(payload.room_id)
        except Exception as e:
            logger.error("error joining room:", e)

    async def _handle_leave(self, client: ChatClient):
        print("leaving...")
        try:
            await client.reset_state()
        except Exception as e:
            logger.error("error leaving room:", e)

    def _update_last_read(self, text: ChatTextOut, last_read: datetime):
        print(last_read)
        if datetime.fromisoformat(text.timestamp) <= last_read:
            text.read = True
        return text

    async def _handle_restore(self, client: ChatClient, payload: ChatRestoreIn):
        print("restoring...")
        if not client.room:
            return []
        previous = await ChatMessageService.get_messages(
            client.db,
            client.room.id,
            client.user.id,
            payload.since,
        )

        peer_last_read = await status_manager.get_last_read(
            client.room.id, client.user.id
        )
        if peer_last_read:
            previous = [self._update_last_read(p, peer_last_read) for p in previous]

        await client.send_message(ChatRestoredOut(previous=previous))

        now = datetime.now(timezone.utc)

        await status_manager.set_last_read(client.room.id, client.user.id, now)

        if client.peer and await client.peer_is_active():
            print("broadcasting read...")
            await stream_manager.stream_read(
                ChatStreamRead(
                    room_id=str(client.room.id),
                    user_id=str(client.peer.id),
                )
            )

    async def _handle_text(self, client: ChatClient, payload: ChatTextIn):
        print("streaming text...")
        try:
            if client.room:
                await stream_manager.stream_text(
                    ChatStreamText(
                        room_id=str(client.room.id),
                        user_id=str(client.user.id),
                        content=payload.content,
                    )
                )
        except Exception as e:
            logger.error("broadcast error:", e)

    async def handle_payload(self, payload: dict, client: ChatClient):
        try:
            payload = ChatPayloadIn.validate_python(payload)

            print("received:", payload)

            if isinstance(payload, ChatJoinIn):
                await self._handle_join(client, payload)

            elif isinstance(payload, ChatRestoreIn):
                await self._handle_restore(client, payload)

            elif isinstance(payload, ChatTextIn):
                await self._handle_text(client, payload)

        except Exception as e:
            logger.error("handle payload error:", e)
