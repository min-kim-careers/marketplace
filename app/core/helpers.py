import base64
import json
from typing import Any, Iterable
from uuid import UUID

from app.core import logger
from fastapi import Path
from rich import print_json
from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession


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
        stmt = (
            select(1)
            .where(and_(*(getattr(model, k) == v for k, v in filters.items())))
            .limit(1)
        )
        result = await db.execute(stmt)
        return result.scalar_one_or_none() is not None
    except Exception as e:
        logger.info(e)
        return False


def encode_alias(u: UUID) -> str:
    b = u.bytes
    alias = base64.urlsafe_b64encode(b).rstrip(b"=").decode()
    return alias


def decode_alias(s: str) -> UUID:
    padding = "=" * (-len(s) % 4)
    b = base64.urlsafe_b64decode(s + padding)
    return UUID(bytes=b)


def json_print(data: dict):
    print_json(json.dumps(data))


def deep_get(d: dict, keys: Iterable, default: Any = None) -> Any:
    for k in keys:
        if isinstance(d, dict):
            d = d.get(k, default)
        else:
            return default
    return d
