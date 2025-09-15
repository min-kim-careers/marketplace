from collections import defaultdict
from typing import List
from uuid import UUID

from app.chat.server.client import ChatClient
from app.chat.server.schemas.inbound import (
    ChatJoinIn,
    ChatPayloadIn,
    ChatRestoreIn,
    ChatTextIn,
)
from app.chat.server.schemas.outbound import (
    ChatConnectedOut,
    ChatErrorOut,
    ChatJoinedOut,
    ChatRestoreOut,
    ChatTextOut,
)
from app.chat.server.stream import ChatStream, StreamMessage
from app.chat.services.chat_message import ChatMessageService
from app.core import logger


class ChatManager:
    def __init__(self) -> None:
        self.rooms: dict[UUID, set[ChatClient]] = defaultdict(set)
        self.stream: ChatStream = ChatStream()

    async def connect(self, client: ChatClient):
        print("connecting...")
        await client.conn.accept()
        client.run_tasks()
        await client.send_message(ChatConnectedOut())
        return client

    async def disconnect(self, client: ChatClient):
        print("disconnecting...")
        await self.leave(client)
        await client.end_tasks()

    async def join(self, room_id: UUID, client: ChatClient) -> bool:
        if await client.set_room(room_id):
            self.rooms[room_id].add(client)
            return True
        return False

    async def leave(self, client: ChatClient):
        if client.room:
            self.rooms[client.room.id].remove(client)
            if not self.rooms[client.room.id]:
                del self.rooms[client.room.id]
            await client.unset_room()
            await client.reset_state()

    async def broadcast(self, content: str, client: ChatClient):
        try:
            await self.stream.enqueue_message(
                StreamMessage(
                    room_id=str(client.room),
                    user_id=str(client.user_id),
                    content=content,
                )
            )
        except Exception as e:
            logger.error("broadcast error:", e)

    async def restore(self, client: ChatClient, since: str) -> List[ChatTextOut]:
        if not client.room:
            return []
        return await ChatMessageService.get_messages(
            client.db, client.room.id, client.user_id, since
        )

    async def handle_payload(self, payload: dict, client: ChatClient):
        try:
            payload = ChatPayloadIn.validate_python(payload)

            if isinstance(payload, ChatJoinIn):
                if await self.join(payload.room_id, client):
                    await client.send_message(ChatJoinedOut())
                else:
                    await client.send_message(ChatErrorOut(message="failed to join"))

            elif isinstance(payload, ChatRestoreIn):
                previous = await self.restore(client, payload.since)
                await client.send_message(ChatRestoreOut(previous=previous))

            elif isinstance(payload, ChatTextIn):
                await self.broadcast(payload.content, client)

        except Exception as e:
            logger.error("handle payload error:", e)
