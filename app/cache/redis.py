from redis.asyncio import Redis

from app.core import env


redis = Redis(
    host=env.CACHE_HOST,
    port=int(env.CACHE_PORT),
    db=int(env.CACHE_DB),
    password=env.CACHE_PASSWORD,
    decode_responses=True,
)
