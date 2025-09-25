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
)
from app.chat.server.schemas.internal import (
    ChatInternalRead,
    ChatInternalText,
    ChatInternalTyping,
)
from app.chat.services.chat_message import ChatMessageService
from app.core import logger
from app.chat.server.streamer import chat_streamer
from app.chat.server.cache import chat_cache


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
            if not client.room:
                raise

            previous = await ChatMessageService.get_messages(
                client.db,
                client.room.id,
                client.user.id,
                payload.since,
            )

            status = await ChatRoomRepository.status_by_user(
                client.db, client.user.id, client.room.id
            )
            if status:
                for p in previous:
                    if datetime.fromisoformat(p.timestamp) <= status.last_read:
                        p.read = True

                await client.send_message(ChatRestoredOut(previous=previous))

                status.last_read = datetime.now(timezone.utc)
                await client.db.commit()

                await broadcast_room(
                    ChatInternalRead(
                        room_id=str(client.room.id),
                        user_id=str(client.user.id),
                    )
                )

                await chat_cache.remove_unread_room(client.user.id, client.room.id)
        except Exception as e:
            logger.exception("handle restore error: %s", e)

    async def _handle_text(self, client: ChatClient, payload: ChatTextIn):
        print("streaming text...")
        try:
            if client.room and client.peer:
                await chat_streamer.stream_text(
                    ChatInternalText(
                        room_id=str(client.room.id),
                        user_id=str(client.user.id),
                        content=payload.content,
                    )
                )
                await ChatRoomRepository.update_room_activity(client.db, client.room.id)

                await chat_cache.add_unread_room(client.peer.id, client.room.id)

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
