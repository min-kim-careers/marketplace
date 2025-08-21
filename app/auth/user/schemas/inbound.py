from typing import Optional
from uuid import UUID
from app.core.schemas.outbound import OutboundBase


class UserInDB(OutboundBase):
    id: Optional[UUID] = None
    provider_name: str
    provider_user_id: str
    chat_user_id: str
