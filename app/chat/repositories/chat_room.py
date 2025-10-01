from datetime import datetime, timezone
from typing import Sequence
from uuid import UUID

from sqlalchemy import asc, desc, or_, select, update

from app.chat.enums import RoomSortOrder
from app.chat.schemas.inbound import ChatRoomInDB, ChatRoomQuery
from app.core.logger import log_class_exceptions
from app.core.helpers import get_one_by
from app.db.models.chat_status import ChatStatusDB
from app.db.models.chat_room import ChatRoomDB
from sqlalchemy.ext.asyncio import AsyncSession


@log_class_exceptions
class ChatRoomRepository:
    @staticmethod
    async def rooms_paginated(
        db: AsyncSession, query: ChatRoomQuery, user_id: UUID
    ) -> Sequence[ChatRoomDB]:
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

    @staticmethod
    async def update_room_activity(db: AsyncSession, room_id: UUID) -> bool:
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
        except Exception:
            await db.rollback()
            raise

    @staticmethod
    async def room_by_item_and_buyer(
        db: AsyncSession, item_id: UUID, buyer_id: UUID
    ) -> ChatRoomDB:
        return await get_one_by(
            db,
            ChatRoomDB,
            item_id=item_id,
            buyer_id=buyer_id,
        )

    @staticmethod
    async def room_by_id(db: AsyncSession, room_id: UUID) -> ChatRoomDB:
        return await get_one_by(
            db,
            ChatRoomDB,
            id=room_id,
        )

    @staticmethod
    async def create_with_status(db: AsyncSession, room_in: ChatRoomInDB) -> ChatRoomDB:
        try:
            room = ChatRoomDB(**room_in.model_dump())
            db.add(room)
            await db.flush()

            buyer_status = ChatStatusDB(
                user_id=room_in.buyer_id,
                room_id=room.id,
            )
            seller_status = ChatStatusDB(
                user_id=room_in.seller_id,
                room_id=room.id,
            )

            db.add_all([buyer_status, seller_status])

            await db.commit()
            await db.refresh(room)
            return room
        except Exception:
            await db.rollback()
            raise

    @staticmethod
    async def status_by_user(
        db: AsyncSession, user_id: UUID, room_id: UUID
    ) -> ChatStatusDB:
        return await get_one_by(db, ChatStatusDB, user_id=user_id, room_id=room_id)

    @staticmethod
    async def statuses_by_room(
        db: AsyncSession, room_id: UUID
    ) -> Sequence[ChatStatusDB]:
        stmt = select(ChatStatusDB).where(ChatStatusDB.room_id == room_id)
        res = await db.execute(stmt)
        return res.scalars().all()

    @staticmethod
    async def update_last_read(
        db: AsyncSession, user_id: UUID, room_id: UUID, last_read: datetime
    ) -> bool:
        try:
            stmt = (
                update(ChatStatusDB)
                .where(
                    ChatStatusDB.user_id == user_id,
                    ChatStatusDB.room_id == room_id,
                )
                .values(last_read=last_read)
            )

            res = await db.execute(stmt)
            await db.commit()
            return res.rowcount > 0
        except Exception:
            await db.rollback()
            raise
