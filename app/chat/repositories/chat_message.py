from typing import Sequence
from uuid import UUID

from sqlalchemy import desc, or_, select

from app.core import logger
from app.db.models.chat_message import ChatMessageDB
from sqlalchemy.ext.asyncio import AsyncSession


class ChatMessageRepository:
    @staticmethod
    async def messages_offset(
        db: AsyncSession,
        room_id: UUID,
        offset: int,
        limit: int,
    ) -> Sequence[ChatMessageDB]:
        try:
            stmt = select(ChatMessageDB).where(or_(ChatMessageDB.room_id == room_id))

            stmt = (
                stmt.offset(offset).limit(limit).order_by(desc(ChatMessageDB.timestamp))
            )
            result = await db.execute(stmt)
            return result.scalars().all()
        except Exception as e:
            logger.info(e)
            return []

    @staticmethod
    async def create_message(
        db: AsyncSession,
        user_id: UUID,
        room_id: UUID,
        content: str,
    ) -> ChatMessageDB | None:
        try:
            room = ChatMessageDB(
                user_id=user_id,
                room_id=room_id,
                content=content,
            )
            db.add(room)
            await db.commit()
            await db.refresh(room)
            return room
        except Exception as e:
            await db.rollback()
            logger.info(e)
            return None
