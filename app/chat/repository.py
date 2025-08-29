from uuid import UUID

from sqlalchemy import Select, select

from app.chat.schemas.inbound import ChatRoomInDB, RoomQuery
from app.core import logger
from app.core.helpers import get_one_by
from app.db.models.chat_room import ChatRoomDB
from sqlalchemy.ext.asyncio import AsyncSession


class ChatRepository:
    @staticmethod
    def build_query(stmt: Select, query: RoomQuery):
        # if query.keyword:
        #     or_conditions = [
        #         func.lower(ChatRoomDB.name).ilike(f"%{query.keyword}%"),
        #         func.lower(ChatRoomDB.description).ilike(f"%{query.keyword}%"),
        #         func.lower(cast(ChatRoomDB.category, String)).ilike(f"%{query.keyword}%"),
        #     ]
        #     stmt = stmt.where(
        #         or_(*or_conditions),
        #     )
        # if user_id:
        #     if query.user_option == ItemUserOption.exclude_user:
        #         stmt = stmt.where(
        #             ChatRoomDB.user_id != user_id,
        #         )
        #     elif query.user_option == ItemUserOption.user_only:
        #         stmt = stmt.where(
        #             ChatRoomDB.user_id == user_id,
        #         )
        # if query.active_only:
        #     stmt = stmt.where(
        #         ChatRoomDB.status.in_(
        #             [
        #                 ItemStatus.available,
        #                 ItemStatus.pending,
        #             ]
        #         )
        #     )
        # if query.categories:
        #     stmt = stmt.where(ChatRoomDB.category.in_(query.categories))

        return stmt

    @staticmethod
    async def rooms_paginated(
        db: AsyncSession,
        query: RoomQuery,
        buyer_id: UUID,
    ):
        try:
            stmt = select(ChatRoomDB)

            stmt = ChatRepository.build_query(stmt, query)

            if query.sort_by:
                sort_column = getattr(ChatRoomDB, query.sort_by.value)
                if query.sort_order == ItemSortOrder.asc:
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
