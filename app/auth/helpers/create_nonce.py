from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Body
import httpx
import jwt

from app.core import env
from app.core.logger import log_exception


@log_exception
def create_nonce(minutes: int):
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=minutes)
    nonce = jwt.encode(
        {"ts": datetime.now(timezone.utc).timestamp(), "exp": expires_at.timestamp()},
        env.NONCE_SECRET,
        algorithm="HS256",
    )
    return nonce
