import asyncio
from datetime import datetime
from typing import Annotated, Literal, Optional, Union
from uuid import UUID

from pydantic import BaseModel, Field, TypeAdapter
from app.cache.redis import redis


from redis.exceptions import ResponseError

from app.chat.repositories.chat_message import ChatMessageRepository
from app.chat.repositories.chat_room import ChatRoomRepository
from app.chat.server.helpers import broadcast_key
from app.core import logger
from app.db.session import AsyncSessionLocal

from sqlalchemy.ext.asyncio import AsyncSession


class ChatStreamText(BaseModel):
    type: Literal["text"] = "text"
    user_id: str
    room_id: str
    content: str
    timestamp: Optional[str] = None


class ChatStreamRead(BaseModel):
    type: Literal["read"] = "read"
    user_id: str
    room_id: str
    last_read_at: datetime


ChatStreamType = Annotated[
    Union[
        ChatStreamText,
        ChatStreamRead,
    ],
    Field(discriminator="type"),
]

ChatStream = TypeAdapter(ChatStreamType)


class ChatStreamer:
    def __init__(self) -> None:
        self.STREAM_KEY = "chat:stream"
        self.GROUP = "g1"
        self.CONSUMER = "c1"
        self.BATCH_SIZE = 20

        self._init()

    def _init(self):
        asyncio.create_task(self._create_stream())
        asyncio.create_task(self._run_consumer())

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
        return True

    async def _handle_read(self, db: AsyncSession, stream: ChatStreamRead) -> bool:
        status_db = await ChatRoomRepository.update_last_read_at(
            db,
            UUID(stream.user_id),
            UUID(stream.room_id),
        )
        if not status_db:
            logger.error("error updating status")
            return False
        return True

    async def _process_stream(self, db: AsyncSession, id: str, stream: ChatStreamType):
        print("from stream:", id, stream)

        _stream = ChatStream.validate_python(stream)

        processed = False

        if isinstance(_stream, ChatStreamText):
            processed = await self._handle_text(db, _stream)

        elif isinstance(_stream, ChatStreamRead):
            processed = await self._handle_read(db, _stream)

        if processed:
            await redis.publish(
                broadcast_key(stream.room_id),
                stream.model_dump_json(),
            )
            print(f"broadcasted to: {broadcast_key(stream.room_id)}")
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

    async def enqueue_text(self, msg: ChatStreamText):
        msg_id = await redis.xadd(
            self.STREAM_KEY,
            {
                "type": msg.type,
                "room_id": msg.room_id,
                "user_id": msg.user_id,
                "content": msg.content,
            },
        )
        return msg_id

    async def enqueue_read(self, msg: ChatStreamRead):
        msg_id = await redis.xadd(
            self.STREAM_KEY,
            {
                "type": msg.type,
                "room_id": msg.room_id,
                "user_id": msg.user_id,
                "last_read_at": datetime.isoformat(msg.last_read_at),
            },
        )
        return msg_id
