from typing import Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_


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
