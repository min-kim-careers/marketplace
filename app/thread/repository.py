from app.core import logger
from app.db.models.thread import ThreadDB
from sqlalchemy.ext.asyncio import AsyncSession


class ThreadRepository:
    @staticmethod
    async def create(db: AsyncSession) -> ThreadDB | None:
        try:
            thread_db = ThreadDB()

            db.add(thread_db)
            await db.commit()
            await db.refresh(thread_db)
            return thread_db
        except Exception as e:
            await db.rollback()
            logger.info(e)
            return None
