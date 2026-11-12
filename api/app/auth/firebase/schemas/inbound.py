from pydantic import Field
from app.core.schemas.inbound import InboundBase


class GetSessionRequest(InboundBase):
    id_token: str
    nonce: str | None = None
    is_new_user: bool | None = False
