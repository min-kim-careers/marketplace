from app.core.schemas.outbound import OutboundBase


class UserInDB(OutboundBase):
    provider_name: str
    provider_id: str
