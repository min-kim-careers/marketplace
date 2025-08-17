from pydantic import BaseModel


class SynapseLoginResponse(BaseModel):
    user_id: str
    access_token: str
    home_server: str
    device_id: str