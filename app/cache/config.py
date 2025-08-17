from app.core import env_loader
import redis


cache = redis.Redis(
    host=env_loader.CACHE_HOST,
    port=int(env_loader.CACHE_PORT),
    db=int(env_loader.CACHE_DB),
    password=env_loader.CACHE_PASSWORD,
    decode_responses=True,
)
