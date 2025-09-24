from app.cache.cache import redis
from app.chat.server.helpers.broadcast_key import broadcast_key
from app.chat.server.schemas.internal import ChatInternalType


async def broadcast_room(payload: ChatInternalType):
    await redis.publish(
        broadcast_key(payload.room_id),
        payload.model_dump_json(),
    )
