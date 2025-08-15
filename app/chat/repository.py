from datetime import datetime
from uuid import UUID

from sqlalchemy import and_, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core import utils
from app.db.models.chat_room import ChatRoomDB


class ChatRepository:
    @staticmethod
    async def get_room_by_user_and_peer(
        db: AsyncSession, user_id: UUID, peer_id: UUID
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
                )
            )
            result = await db.execute(stmt)
            return result.scalar_one_or_none()
        except Exception as e:
            print(e)

    @staticmethod
    async def create(
        db: AsyncSession, room_id: str, user_ids: list[UUID]
    ) -> ChatRoomDB | None:
        try:
            user_ids = sorted(user_ids)
            chat_room = ChatRoomDB(
                room_id=room_id,
                user_1_id=user_ids[0],
                user_2_id=user_ids[1],
            )

            db.add(chat_room)
            await db.commit()
            await db.refresh(chat_room)
            return chat_room
        except Exception as e:
            await db.rollback()
            print(e)
            return None
