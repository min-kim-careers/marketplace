import base64
from typing import Any
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from fastapi import Path


async def get_one_by(session: AsyncSession, model, **filters) -> Any | None:
    try:
        stmt = select(model).where(
            and_(*(getattr(model, k) == v for k, v in filters.items()))
        )
        result = await session.execute(stmt)
        return result.scalar_one_or_none()
    except Exception as e:
        print(e)
        return None

def uuid_to_slug(u: UUID) -> str:
    b = u.bytes
    slug = base64.urlsafe_b64encode(b).rstrip(b"=").decode()
    return slug

def slug_to_uuid(s: str) -> UUID:
    padding = "=" * (-len(s) % 4)
    b = base64.urlsafe_b64decode(s + padding)
    return UUID(bytes=b)