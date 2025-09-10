from datetime import datetime
from typing import List
from uuid import UUID


from app.chat.constants import DEFAULT_RESTORE_LIMIT
from app.chat.repositories.chat_message import ChatMessageRepository
from app.chat.server.schemas.outbound import ChatTextOut
from sqlalchemy.ext.asyncio import AsyncSession


class ChatMessageService:
    @staticmethod
    async def get_messages(
        db: AsyncSession,
        room_id: UUID,
        user_id: UUID,
        since: str,
    ) -> List[ChatTextOut]:
        messages_db = await ChatMessageRepository.messages_offset(
            db, room_id, datetime.fromisoformat(since), DEFAULT_RESTORE_LIMIT
        )
        return [ChatTextOut.from_db(m, user_id) for m in messages_db]
