from datetime import datetime
from uuid import UUID

from app.core.schemas.outbound import OutboundBase
from app.db.models.message import MessageDB


class MessageOut(OutboundBase):
    thread_id: UUID
    content: str
    created_at: datetime
    updated_at: datetime

    @classmethod
    def from_db(cls, m: MessageDB) -> "MessageOut":
        return cls.model_validate(
            {
                **m.__dict__,
            },
            from_attributes=True,
        )
