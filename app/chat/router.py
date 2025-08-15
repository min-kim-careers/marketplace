from typing import Dict, List
from fastapi import APIRouter, Depends, Path
import httpx

from app.auth.firebase.dependencies import resolve_firebase_query_token
from app.chat.repository import ChatRepository
from app.chat.service import ChatService
from app.core.config import env_loader
from app.core.schemas.error import ErrorResponse
from app.core.schemas.outbound import APIResponse
from app.core.security import verify_service_key
from app.core.utils import encode_slug
from app.db.models.user import UserDB
from app.chat.websocket import chat_ws_router
from app.db.session import get_db
from app.profile.repository import ProfileRepository
from sqlalchemy.ext.asyncio import AsyncSession


chat_router = APIRouter(
    prefix="/api/chat",
    tags=["Chat"],
    dependencies=[Depends(verify_service_key)],
)

# class ConnectionManager:
#     def __init__(self) -> None:
#         self.rooms: Dict[str, List[WebSocket]] = {}

#     async def connect(self, room_id: str, websocket: WebSocket):
#         await websocket.accept()
#         self.rooms.setdefault(room_id, []).append(websocket)

#     def disconnect(self, room_id: str, websocket: WebSocket):
#         self.rooms[room_id].remove(websocket)
#         if not self.rooms[room_id]:
#             del self.rooms[room_id]

#     async def broadcast(self, room_id: str, message: str):
#         for conn in self.rooms.get(room_id, []):
#             await conn.send_text(message)


# manager = ConnectionManager()


async def resolve_peer_user(
    peer_handle: str = Path(..., alias="peerHandle"),
    db: AsyncSession = Depends(get_db),
):
    peer = await ProfileRepository.get_by_handle(db, peer_handle)
    if not peer:
        raise ErrorResponse(status_code=401, message="peer handle not found")
    return peer


@chat_router.post("/peerHandle/{peerHandle}")
async def get_room_slug(
    user: UserDB = Depends(resolve_firebase_query_token),
    peer: UserDB = Depends(resolve_peer_user),
    db: AsyncSession = Depends(get_db),
):
    room = await ChatRepository.get_room_by_user_and_peer(db, user.id, peer.id)

    room_slug = None
    if not room:
        access_token = await ChatService.get_access_token(str(user.id), str(user.id))
        room_id = await ChatService.create_room(access_token)
        if not room_id:
            raise ErrorResponse(message="failed to get room id")
        room = await ChatRepository.create(db, room_id, user_ids=[user.id, peer.id])
        if not room:
            delete_id = await ChatService.delete_room(room_id)
            raise ErrorResponse(
                message=(
                    "failed to create db room"
                    + ("" if delete_id else "and delete synapse room")
                )
            )

    room_slug = encode_slug(room.id)
    return APIResponse(data={"roomSlug": room_slug})
