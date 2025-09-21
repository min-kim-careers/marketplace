import asyncio
from uuid import UUID

from app.cache.cache import redis


from redis.exceptions import ResponseError

from app.chat.repositories.chat_message import ChatMessageRepository
from app.chat.repositories.chat_room import ChatRoomRepository
from app.chat.server.helpers import broadcast_internal, broadcast_key
from app.chat.server.schemas.internal import (
    ChatInternalRead,
    ChatInternalText,
)
from app.chat.server.schemas.internal import ChatInternalType
from app.chat.server.schemas.internal import ChatInternalAdapter
from app.core import logger
from app.db.session import AsyncSessionLocal

from sqlalchemy.ext.asyncio import AsyncSession


class ChatStreamManager:
    def __init__(self) -> None:
        self.STREAM_KEY = "chat:stream"
        self.GROUP = "g1"
        self.CONSUMER = "c1"
        self.BATCH_SIZE = 20

        self._init()

    def _init(self):
        asyncio.gather(self._create_stream(), self._run_consumer())

    async def _create_stream(self):
        try:
            await redis.xgroup_create(
                self.STREAM_KEY, self.GROUP, id="$", mkstream=True
            )
        except ResponseError as e:
            if "BUSYGROUP" not in str(e):
                raise

    async def _handle_text(self, db: AsyncSession, payload: ChatInternalText):
        msg_db = await ChatMessageRepository.create_message(
            db,
            user_id=UUID(payload.user_id),
            room_id=UUID(payload.room_id),
            content=payload.content,
        )
        if not msg_db:
            raise Exception("error persisting text")

        payload.timestamp = msg_db.timestamp.isoformat()
        await broadcast_internal(payload)
        print(f"broadcasted text to: {broadcast_key(payload.room_id)}")

    async def _handle_read(self, db: AsyncSession, payload: ChatInternalRead):
        updated = await ChatRoomRepository.update_last_read(
            db,
            user_id=UUID(payload.user_id),
            room_id=UUID(payload.room_id),
        )
        if not updated:
            raise Exception("error persisting status read")

        await broadcast_internal(payload)
        print(f"broadcasted read to: {broadcast_key(payload.room_id)}")

    async def _process_payload(
        self, db: AsyncSession, stream_id: str, payload: ChatInternalType
    ):
        try:
            print("from stream:", stream_id, payload)

            payload = ChatInternalAdapter.validate_python(payload)

            if isinstance(payload, ChatInternalText):
                await self._handle_text(db, payload)

            elif isinstance(payload, ChatInternalRead):
                await self._handle_read(db, payload)

            await redis.xack(self.STREAM_KEY, self.GROUP, stream_id)
        except Exception as e:
            logger.error("error processing payload in stream:", e)

    async def _run_consumer(self):
        while True:
            try:
                resp = await redis.xreadgroup(
                    self.GROUP,
                    self.CONSUMER,
                    {self.STREAM_KEY: ">"},
                    count=self.BATCH_SIZE,
                    block=5000,
                )
                if not resp:
                    continue
                entries = [
                    (msg_id, stream) for _, msgs in resp for msg_id, stream in msgs
                ]
                async with AsyncSessionLocal() as db:
                    for stream_id, payload in entries:
                        await self._process_payload(db, stream_id, payload)

            except Exception as e:
                logger.error("stream consumer error:", e)
                continue

    async def stream_text(self, text: ChatInternalText):
        id = await redis.xadd(
            self.STREAM_KEY,
            {
                "type": text.type,
                "room_id": text.room_id,
                "user_id": text.user_id,
                "content": text.content,
            },
        )
        return id

    async def stream_read(self, read: ChatInternalRead):
        id = await redis.xadd(
            self.STREAM_KEY,
            {
                "type": read.type,
                "room_id": read.room_id,
                "user_id": read.user_id,
            },
        )
        return id


stream_manager = ChatStreamManager()
