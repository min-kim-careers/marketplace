from pydantic import BaseModel


class SynapseLoginResponse(BaseModel):
    user_id: str
    access_token: str
    home_server: str
    device_id: str

class SynapseRegisterResponse(BaseModel):
    user_id: str
    access_token: str
    home_server: str
    device_id: str