from app.cache.cache import redis
from app.chat.server.helpers.client_broadcast_key import client_broadcast_key
from app.chat.server.schemas.internal import ChatInternalClient


async def broadcast_client(payload: ChatInternalClient):
    await redis.publish(
        client_broadcast_key(payload.user_id),
        payload.model_dump_json(),
    )
