from typing import Dict, List

from pydantic import BaseModel


class LoginResponse(BaseModel):
    user_id: str
    access_token: str
    home_server: str
    device_id: str


class RegisterResponse(BaseModel):
    user_id: str
    access_token: str
    home_server: str
    device_id: str


class Event(BaseModel):
    type: str
    content: dict


class Rooms(BaseModel):
    join: Dict[str, List[Event]]
    invite: Dict[str, List[Event]]
    leave: Dict[str, List[Event]]


class SyncData(BaseModel):
    next_batch: str
    rooms: Rooms
