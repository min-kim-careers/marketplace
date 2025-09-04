from typing import Sequence
from uuid import UUID

from sqlalchemy import asc, desc, or_, select

from app.chat.enums import RoomSortOrder
from app.chat.schemas.inbound import ChatRoomInDB, RoomsQuery
from app.core import logger
from app.core.helpers import get_one_by
from app.db.models.chat_room import ChatRoomDB
from sqlalchemy.ext.asyncio import AsyncSession


class ChatRoomRepository:
    @staticmethod
    async def rooms_paginated(
        db: AsyncSession,
        query: RoomsQuery,
        user_id: UUID,
    ) -> Sequence[ChatRoomDB]:
        try:
            stmt = select(ChatRoomDB).where(
                or_(
                    ChatRoomDB.buyer_id == user_id,
                    ChatRoomDB.seller_id == user_id,
                )
            )

            if query.sort_by:
                sort_column = getattr(ChatRoomDB, query.sort_by.value)
                if query.sort_order == RoomSortOrder.asc:
                    stmt = stmt.order_by(asc(sort_column))
                else:
                    stmt = stmt.order_by(desc(sort_column))

            stmt = stmt.offset(query.offset).limit(query.limit)
            result = await db.execute(stmt)
            return result.scalars().all()
        except Exception as e:
            logger.info(e)
            return []

    @staticmethod
    async def room_by_item_and_buyer(
        db: AsyncSession,
        item_id: UUID,
        buyer_id: UUID,
    ) -> ChatRoomDB | None:
        return await get_one_by(
            db,
            ChatRoomDB,
            item_id=item_id,
            buyer_id=buyer_id,
        )

    @staticmethod
    async def create_room(
        db: AsyncSession,
        room_in: ChatRoomInDB,
    ) -> ChatRoomDB | None:
        try:
            room = ChatRoomDB(**room_in.model_dump())
            db.add(room)
            await db.commit()
            await db.refresh(room)
            return room
        except Exception as e:
            await db.rollback()
            logger.info(e)
            return None
