import base64
from typing import Any
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from fastapi import Path

from app.core import logger


async def get_one_by(db: AsyncSession, model, **filters) -> Any | None:
    try:
        stmt = select(model).where(
            and_(*(getattr(model, k) == v for k, v in filters.items()))
        )
        result = await db.execute(stmt)
        return result.scalar_one_or_none()
    except Exception as e:
        logger.info(e)
        return None
    
async def get_exists_by(db: AsyncSession, model, **filters) -> bool:
    try:
        stmt = select(1).where(
            and_(*(getattr(model, k) == v for k, v in filters.items()))
        ).limit(1)
        result = await db.execute(stmt)
        return result.scalar_one_or_none() is not None
    except Exception as e:
        logger.info(e)
        return False

def encode_slug(u: UUID) -> str:
    b = u.bytes
    slug = base64.urlsafe_b64encode(b).rstrip(b"=").decode()
    return slug

def decode_slug(s: str) -> UUID:
    padding = "=" * (-len(s) % 4)
    b = base64.urlsafe_b64decode(s + padding)
    return UUID(bytes=b)