import asyncio
from uuid import UUID

from app.cache.cache import redis


from redis.exceptions import ResponseError

from app.chat.repositories.chat_message import ChatMessageRepository
from app.chat.server.helpers.room_broadcast_key import room_broadcast_key
from app.chat.server.helpers.broadcast_room import broadcast_room
from app.chat.server.schemas.internal import (
    ChatInternalText,
)
from app.chat.server.schemas.internal import ChatInternalType
from app.chat.server.schemas.internal import ChatInternalAdapter
from app.core.logger import logger
from app.db.session import AsyncSessionLocal
from sqlalchemy.ext.asyncio import AsyncSession


class ChatStreamer:
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
        try:
            msg_db = await ChatMessageRepository.create_message(
                db,
                user_id=UUID(payload.user_id),
                room_id=UUID(payload.room_id),
                content=payload.content,
            )
            payload.timestamp = msg_db.timestamp.isoformat()
            await broadcast_room(payload)
            print(f"broadcasted text in: {room_broadcast_key(payload.room_id)}")
        except Exception:
            logger.exception("error handling text in streamer")

    async def _process_payload(
        self, db: AsyncSession, stream_id: str, payload: ChatInternalType
    ):
        try:
            print("from stream:", stream_id, payload)

            payload = ChatInternalAdapter.validate_python(payload)

            if isinstance(payload, ChatInternalText):
                await self._handle_text(db, payload)

            await redis.xack(self.STREAM_KEY, self.GROUP, stream_id)
        except Exception:
            logger.exception("error processing payload in manager")

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
                        try:
                            print("from stream:", stream_id, payload)

                            payload = ChatInternalAdapter.validate_python(payload)

                            if isinstance(payload, ChatInternalText):
                                await self._handle_text(db, payload)

                            await redis.xack(self.STREAM_KEY, self.GROUP, stream_id)
                        except Exception:
                            logger.exception(
                                "error processing payload in streamer consumer"
                            )

            except Exception:
                logger.exception("error in stream consumer")
                continue

    async def stream_text(self, payload: ChatInternalText):
        id = await redis.xadd(
            self.STREAM_KEY,
            {
                "type": payload.type,
                "room_id": payload.room_id,
                "user_id": payload.user_id,
                "content": payload.content,
            },
        )
        return id


chat_streamer = ChatStreamer()
