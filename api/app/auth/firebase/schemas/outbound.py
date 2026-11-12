from typing import Optional


from app.core.schemas.outbound import OutboundBase


class FirebaseUser(OutboundBase):
    uid: str
    email: str
    picture: Optional[str] = None
