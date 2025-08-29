from typing import Sequence
from uuid import UUID

from app.core import logger
from app.db.models.message import MessageDB
from app.message.enums import MessageSortOrder
from app.message.schemas.inbound import (
    MessageInCreateDB,
    MessageInUpdateDB,
    MessageQuery,
)
from sqlalchemy import asc, desc, select
from sqlalchemy.ext.asyncio import AsyncSession


class MessageRepository:
    @staticmethod
    async def query_paginated(
        db: AsyncSession,
        thread_id: UUID,
        query: MessageQuery,
    ) -> Sequence[MessageDB] | None:
        try:
            stmt = select(MessageDB).where(MessageDB.thread_id == thread_id)

            if query.sort_by:
                sort_column = getattr(MessageDB, query.sort_by.value)
                if query.sort_order == MessageSortOrder.asc:
                    stmt = stmt.order_by(asc(sort_column))
                else:
                    stmt = stmt.order_by(desc(sort_column))

            stmt = stmt.offset(query.offset).limit(query.limit)
            result = await db.execute(stmt)
            return result.scalars().all()
        except Exception as e:
            logger.info(e)
            return None

    @staticmethod
    async def create(
        db: AsyncSession, thread_id: UUID, message_in: MessageInCreateDB
    ) -> MessageDB | None:
        try:
            message_db = MessageDB(
                **message_in.model_dump(
                    exclude_unset=True,
                ),
                thread_id=thread_id,
            )

            db.add(message_db)
            await db.commit()
            await db.refresh(message_db)
            return message_db
        except Exception as e:
            await db.rollback()
            logger.info(e)
            return None

    @staticmethod
    async def update(
        db: AsyncSession, message_db: MessageDB, message_in: MessageInUpdateDB
    ) -> MessageDB | None:
        try:
            for field, value in message_in.model_dump(
                exclude_unset=True,
                exclude_none=True,
            ).items():
                setattr(message_db, field, value)

            await db.commit()
            await db.refresh(message_db)
            return message_db
        except Exception as e:
            await db.rollback()
            logger.info(e)
            return None
