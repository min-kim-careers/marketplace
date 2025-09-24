from datetime import datetime, timezone

from app.chat.repositories.chat_room import ChatRoomRepository
from app.chat.server.helpers.broadcast_key import broadcast_key
from app.chat.server.client import ChatClient
from app.chat.server.helpers.broadcast_room import broadcast_room
from app.chat.server.schemas.inbound import (
    ChatJoinIn,
    ChatPayloadIn,
    ChatRestoreIn,
    ChatTextIn,
    ChatTypingIn,
)
from app.chat.server.schemas.outbound import (
    ChatRestoredOut,
    ChatTextOut,
)
from app.chat.server.schemas.internal import (
    ChatInternalRead,
    ChatInternalText,
    ChatInternalTyping,
)
from app.chat.services.chat_message import ChatMessageService
from app.core import logger
from app.chat.server.cache import chat_cache
from app.chat.server.streamer import chat_streamer


class ChatManager:
    async def connect(self, client: ChatClient):
        print("connecting...")
        await client.run()
        return client

    async def disconnect(self, client: ChatClient):
        print("disconnecting...")
        await self._handle_leave(client)
        await client.close()

    async def _handle_join(self, client: ChatClient, payload: ChatJoinIn):
        print("joining...")
        try:
            if client.is_in_session():
                await client.reset_state()

            await client.init_state(payload.room_id)
        except Exception as e:
            logger.exception("error joining room: %s", e)

    async def _handle_leave(self, client: ChatClient):
        print("leaving...")
        try:
            if client.is_in_session():
                await client.reset_state()
        except Exception as e:
            logger.exception("error leaving room: %s", e)

    async def _handle_restore(self, client: ChatClient, payload: ChatRestoreIn):
        try:
            print("restoring...")
            if not client.room or not client.peer:
                return []
            previous = await ChatMessageService.get_messages(
                client.db,
                client.room.id,
                client.user.id,
                payload.since,
            )

            peer_last_read = await chat_cache.get_last_read(
                client.room.id, client.user.id
            )
            if peer_last_read:

                def _update_last_read(text: ChatTextOut, last_read: datetime):
                    if datetime.fromisoformat(text.timestamp) <= last_read:
                        text.read = True
                    return text

                previous = [_update_last_read(p, peer_last_read) for p in previous]

            await client.send_message(ChatRestoredOut(previous=previous))

            await chat_cache.set_last_read(
                client.room.id, client.user.id, datetime.now(timezone.utc)
            )

            await chat_streamer.stream_read(
                ChatInternalRead(
                    room_id=str(client.room.id),
                    user_id=str(client.peer.id),
                )
            )
        except Exception as e:
            logger.exception("handle restore error: %s", e)

    async def _handle_text(self, client: ChatClient, payload: ChatTextIn):
        print("streaming text...")
        try:
            if client.room:
                await chat_streamer.stream_text(
                    ChatInternalText(
                        room_id=str(client.room.id),
                        user_id=str(client.user.id),
                        content=payload.content,
                    )
                )
                await ChatRoomRepository.update_room_activity(client.db, client.room.id)

        except Exception as e:
            logger.exception("handle text error: %s", e)

    async def _handle_typing(self, client: ChatClient, payload: ChatTypingIn):
        print("typing...")
        try:
            if client.room:
                await broadcast_room(
                    ChatInternalTyping(
                        room_id=str(client.room.id),
                        user_id=str(client.user.id),
                        typing=payload.typing,
                    )
                )
                print(f"broadcasted typing to: {broadcast_key(str(client.room.id))}")
        except Exception as e:
            logger.exception("error leaving room: %s", e)

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

            elif isinstance(payload, ChatTypingIn):
                await self._handle_typing(client, payload)

        except Exception as e:
            logger.exception("handle payload error: %s", e)


chat_manager = ChatManager()
