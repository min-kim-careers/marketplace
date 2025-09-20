import asyncio
from uuid import UUID

from app.cache import redis


from redis.exceptions import ResponseError

from app.chat.repositories.chat_message import ChatMessageRepository
from app.chat.repositories.chat_room import ChatRoomRepository
from app.chat.server.helpers import broadcast_key
from app.chat.server.stream.schemas import ChatStreamRead, ChatStreamText
from app.chat.server.stream.schemas import ChatStreamType
from app.chat.server.stream.schemas import ChatStreamAdapter
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

    async def _handle_text(self, db: AsyncSession, stream: ChatStreamText) -> bool:
        msg_db = await ChatMessageRepository.create_message(
            db,
            user_id=UUID(stream.user_id),
            room_id=UUID(stream.room_id),
            content=stream.content,
        )
        if not msg_db:
            logger.error("error persisting text")
            return False

        stream.timestamp = msg_db.timestamp.isoformat()
        await redis.publish(
            broadcast_key(stream.room_id),
            stream.model_dump_json(),
        )
        print(f"broadcasted text to: {broadcast_key(stream.room_id)}")
        return True

    async def _handle_read(self, db: AsyncSession, stream: ChatStreamRead) -> bool:
        updated = await ChatRoomRepository.update_last_read(
            db,
            user_id=UUID(stream.user_id),
            room_id=UUID(stream.room_id),
        )
        if not updated:
            logger.error("error persisting status read")
            return False

        await redis.publish(
            broadcast_key(stream.room_id),
            stream.model_dump_json(),
        )
        print(f"broadcasted read to: {broadcast_key(stream.room_id)}")
        return True

    async def _process_stream(self, db: AsyncSession, id: str, stream: ChatStreamType):
        print("from stream:", id, stream)

        stream = ChatStreamAdapter.validate_python(stream)

        success = False

        if isinstance(stream, ChatStreamText):
            success = await self._handle_text(db, stream)

        elif isinstance(stream, ChatStreamRead):
            success = await self._handle_read(db, stream)

        if success:
            await redis.xack(self.STREAM_KEY, self.GROUP, id)

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
                    for id, stream in entries:
                        await self._process_stream(db, id, stream)

            except Exception as e:
                logger.error("stream consumer error:", e)
                continue

    async def stream_text(self, text: ChatStreamText):
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

    async def stream_read(self, read: ChatStreamRead):
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
