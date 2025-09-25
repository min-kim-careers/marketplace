from datetime import datetime, timezone
from typing import Sequence
from uuid import UUID

from sqlalchemy import asc, desc, or_, select, update

from app.chat.enums import RoomSortOrder
from app.chat.schemas.inbound import ChatRoomInDB, ChatRoomQuery
from app.core import logger
from app.core.helpers import get_one_by
from app.db.models.chat_room import ChatRoomDB, ChatRoomStatusDB
from sqlalchemy.ext.asyncio import AsyncSession


class ChatRoomRepository:
    @staticmethod
    async def rooms_paginated(
        db: AsyncSession,
        query: ChatRoomQuery,
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
    async def update_room_activity(
        db: AsyncSession,
        room_id: UUID,
    ) -> bool:
        try:
            stmt = (
                update(ChatRoomDB)
                .where(
                    ChatRoomDB.id == room_id,
                )
                .values(updated_at=datetime.now(timezone.utc))
            )

            res = await db.execute(stmt)
            await db.commit()
            return res.rowcount > 0
        except Exception as e:
            await db.rollback()
            logger.info(e)
            return False

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
    async def room_by_id(
        db: AsyncSession,
        room_id: UUID,
    ) -> ChatRoomDB | None:
        return await get_one_by(
            db,
            ChatRoomDB,
            id=room_id,
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

    @staticmethod
    async def create_room_with_status(
        db: AsyncSession,
        room_in: ChatRoomInDB,
    ) -> ChatRoomDB | None:
        try:
            room = ChatRoomDB(**room_in.model_dump())
            db.add(room)
            await db.flush()

            buyer_status = ChatRoomStatusDB(
                user_id=room_in.buyer_id,
                room_id=room.id,
            )
            seller_status = ChatRoomStatusDB(
                user_id=room_in.seller_id,
                room_id=room.id,
            )

            db.add_all([buyer_status, seller_status])

            await db.commit()
            await db.refresh(room)
            return room
        except Exception as e:
            await db.rollback()
            logger.info(e)
            return None

    @staticmethod
    async def status_by_user(
        db: AsyncSession,
        user_id: UUID,
        room_id: UUID,
    ) -> ChatRoomStatusDB | None:
        return await get_one_by(
            db,
            ChatRoomStatusDB,
            user_id=user_id,
            room_id=room_id,
        )

    @staticmethod
    async def statuses_by_room(
        db: AsyncSession,
        room_id: UUID,
    ) -> Sequence[ChatRoomStatusDB]:
        try:
            stmt = select(ChatRoomStatusDB).where(ChatRoomStatusDB.room_id == room_id)

            res = await db.execute(stmt)
            return res.scalars().all()
        except Exception as e:
            await db.rollback()
            logger.info(e)
            return []

    @staticmethod
    async def update_last_read(
        db: AsyncSession,
        user_id: UUID,
        room_id: UUID,
        last_read: datetime,
    ) -> bool | None:
        try:
            stmt = (
                update(ChatRoomStatusDB)
                .where(
                    ChatRoomStatusDB.user_id == user_id,
                    ChatRoomStatusDB.room_id == room_id,
                )
                .values(last_read=last_read)
            )

            res = await db.execute(stmt)
            await db.commit()
            return res.rowcount > 0
        except Exception as e:
            await db.rollback()
            logger.info(e)
            return False

    @staticmethod
    async def create_status(
        db: AsyncSession,
        user_id: UUID,
        room_id: UUID,
    ) -> ChatRoomStatusDB | None:
        try:
            status = ChatRoomStatusDB(
                user_id=user_id,
                room_id=room_id,
            )

            db.add(status)
            await db.commit()
            await db.refresh(status)
            return status
        except Exception as e:
            await db.rollback()
            logger.info(e)
            return None
