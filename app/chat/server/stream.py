import asyncio
from typing import Optional
from uuid import UUID

from pydantic import BaseModel
from app.cache.redis import redis


from redis.exceptions import ResponseError

from app.chat.repositories.chat_message import ChatMessageRepository
from app.chat.server.helpers import pubsub_key
from app.core import logger
from app.db.session import AsyncSessionLocal


class StreamMessage(BaseModel):
    user_id: str
    room_id: str
    content: str
    timestamp: Optional[str] = None


class ChatStream:
    def __init__(self) -> None:
        self.STREAM_KEY = "chat:stream"
        self.GROUP = "g1"
        self.CONSUMER = "c1"
        self.BATCH_SIZE = 20

        self.setup()

    def setup(self):
        asyncio.gather(self.create_stream(), self.consumer())

    async def create_stream(self):
        try:
            await redis.xgroup_create(
                self.STREAM_KEY, self.GROUP, id="$", mkstream=True
            )
        except ResponseError as e:
            if "BUSYGROUP" not in str(e):
                raise

    async def enqueue_message(self, msg: StreamMessage):
        msg_id = await redis.xadd(
            self.STREAM_KEY,
            {
                "room_id": msg.room_id,
                "user_id": msg.user_id,
                "content": msg.content,
            },
        )
        return msg_id

    async def consumer(self):
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
                    (msg_id, fields) for _, msgs in resp for msg_id, fields in msgs
                ]
                async with AsyncSessionLocal() as db:
                    for msg_id, fields in entries:
                        print("got stream:", msg_id, fields)
                        stream_msg = StreamMessage.model_validate(fields)
                        msg_db = await ChatMessageRepository.create_message(
                            db,
                            user_id=UUID(stream_msg.user_id),
                            room_id=UUID(stream_msg.room_id),
                            content=stream_msg.content,
                        )
                        if msg_db:
                            print("persisted")
                            stream_msg.timestamp = msg_db.timestamp.isoformat()
                            await redis.publish(
                                pubsub_key(stream_msg.room_id),
                                stream_msg.model_dump_json(),
                            )
                            print(
                                f"broadcasted to: {pubsub_key(str(stream_msg.room_id))}"
                            )

                            await redis.xack(self.STREAM_KEY, self.GROUP, msg_id)
            except Exception as e:
                logger.error("stream consumer error:", e)
                continue
