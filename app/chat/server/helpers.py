from app.cache.cache import redis
from app.chat.server.schemas.internal import ChatInternalType


def broadcast_key(room_id: str):
    return "chat:channel:room:" + room_id


async def broadcast_internal(payload: ChatInternalType):
    await redis.publish(
        broadcast_key(payload.room_id),
        payload.model_dump_json(),
    )
