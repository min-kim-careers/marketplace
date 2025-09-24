from app.cache.cache import redis
from app.chat.server.constants import CHAT_IDLE_KEY
from app.chat.server.helpers.broadcast_key import broadcast_key
from app.chat.server.schemas.internal import ChatInternalType


async def broadcast_idle(payload: ChatInternalType):
    await redis.publish(
        broadcast_key(str(CHAT_IDLE_KEY)),
        payload.model_dump_json(),
    )
