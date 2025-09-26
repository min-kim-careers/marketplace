from datetime import datetime
from typing import Sequence
from uuid import UUID

from sqlalchemy import desc, func, or_, select

from app.core import logger
from app.db.models.chat_message import ChatMessageDB
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.chat_status import ChatStatusDB


class ChatMessageRepository:
    @staticmethod
    async def messages_offset(
        db: AsyncSession,
        room_id: UUID,
        from_timestamp: datetime,
        limit: int,
    ) -> Sequence[ChatMessageDB]:
        try:
            stmt = select(ChatMessageDB).where(
                or_(ChatMessageDB.room_id == room_id),
                ChatMessageDB.timestamp < from_timestamp,
            )

            stmt = stmt.limit(limit).order_by(desc(ChatMessageDB.timestamp))
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
            logger.exception("create_message failed: %s", e)
            return None

    @staticmethod
    async def unread_exists(
        db: AsyncSession,
        user_id: UUID,
    ) -> bool:
        epoch = datetime(1970, 1, 1)

        try:
            stmt = select(
                select(1)
                .select_from(ChatMessageDB)
                .join(ChatStatusDB, ChatStatusDB.room_id == ChatMessageDB.room_id)
                .where(
                    ChatStatusDB.user_id == user_id,
                    ChatMessageDB.user_id != user_id,
                    ChatMessageDB.timestamp
                    > func.coalesce(ChatStatusDB.last_read, epoch),
                )
                .limit(1)
                .exists()
            )

            res = await db.execute(stmt)
            return bool(res.scalar())
        except Exception as e:
            logger.exception("unread_exists failed: %s", e)
            return False
