from app.cache.cache import redis
from app.chat.server.helpers.room_broadcast_key import room_broadcast_key
from app.chat.server.schemas.internal import ChatInternalType


async def broadcast_room(payload: ChatInternalType):
    await redis.publish(
        room_broadcast_key(payload.room_id),
        payload.model_dump_json(),
    )
