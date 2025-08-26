from datetime import datetime
from typing import Sequence
from uuid import UUID

from sqlalchemy import and_, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.chat.schemas.inbound import ChatRoomInDB
from app.core import helpers, logger
from app.db.models.chat_room import ChatRoomDB


class ChatRepository:
    @staticmethod
    async def get_room_by_id(db: AsyncSession, room_id: UUID) -> ChatRoomDB | None:
        return await helpers.get_one_by(db, ChatRoomDB, id=room_id)

    @staticmethod
    async def get_all_rooms_by_user(
        db: AsyncSession, user_id: UUID
    ) -> Sequence[ChatRoomDB] | None:
        try:
            stmt = select(ChatRoomDB).where(
                or_(
                    ChatRoomDB.user_1_id == user_id,
                    ChatRoomDB.user_2_id == user_id,
                )
            )
            result = await db.execute(stmt)
            return result.scalars().all()
        except Exception as e:
            logger.info(e)

    @staticmethod
    async def get_room_by_users_and_item(
        db: AsyncSession, user_id: UUID, peer_id: UUID, item_id: UUID
    ) -> ChatRoomDB | None:
        try:
            stmt = select(ChatRoomDB).where(
                or_(
                    and_(
                        ChatRoomDB.user_1_id == user_id,
                        ChatRoomDB.user_2_id == peer_id,
                    ),
                    and_(
                        ChatRoomDB.user_1_id == peer_id,
                        ChatRoomDB.user_2_id == user_id,
                    ),
                ),
                and_(
                    ChatRoomDB.item_id == item_id,
                ),
            )
            result = await db.execute(stmt)
            return result.scalar_one_or_none()
        except Exception as e:
            logger.info(e)

    @staticmethod
    async def create(
        db: AsyncSession,
        room_in: ChatRoomInDB,
    ) -> ChatRoomDB | None:
        try:
            chat_room = ChatRoomDB(**room_in.model_dump())
            db.add(chat_room)
            await db.commit()
            await db.refresh(chat_room)
            return chat_room
        except Exception as e:
            await db.rollback()
            logger.info(e)
            return None
