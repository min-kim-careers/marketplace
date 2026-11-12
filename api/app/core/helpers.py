import base64
import json
from typing import Any, Iterable
from uuid import UUID

from app.core.logger import log_exception
from rich import print_json
from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession


@log_exception
async def get_one_by(db: AsyncSession, model, **filters):
    stmt = select(model).where(
        and_(*(getattr(model, k) == v for k, v in filters.items()))
    )
    result = await db.execute(stmt)
    return result.scalar_one()


@log_exception
async def get_exists_by(db: AsyncSession, model, **filters) -> bool:
    stmt = (
        select(1)
        .where(and_(*(getattr(model, k) == v for k, v in filters.items())))
        .limit(1)
    )
    result = await db.execute(stmt)
    return result.scalar_one() is not None


@log_exception
def encode_uuid(u: UUID) -> str:
    return base64.urlsafe_b64encode(u.bytes).rstrip(b"=").decode()


@log_exception
def decode_uuid(s: str) -> UUID:
    padding = "=" * (-len(s) % 4)
    b = base64.urlsafe_b64decode(s + padding)
    return UUID(bytes=b)


def encode_str(s: str) -> str:
    return base64.urlsafe_b64encode(s.encode()).rstrip(b"=").decode()


def decode_str(s: str) -> str:
    padding = "=" * (-len(s) % 4)
    return base64.urlsafe_b64decode(s + padding).decode()


def json_print(data: dict):
    print_json(json.dumps(data))


def deep_get(d: dict, keys: Iterable[tuple[str, Any]]) -> Any:
    for k, default in keys:
        d = d.get(k, default)
    return d
