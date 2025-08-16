from typing import Dict, List
from uuid import UUID

import httpx
from app.auth.firebase.dependencies import (
    resolve_firebase_query_token,
    resolve_firebase_session,
)
from app.chat.dependencies.resolve_peer_user import resolve_peer_user
from app.chat.repository import ChatRepository
from app.chat.schemas.inbound import ChatRoomInDB
from app.chat.service import ChatService
from app.chat.websocket import chat_ws_router
from app.core import logger
from app.core.config import env_loader
from app.core.schemas.error import ErrorResponse
from app.core.schemas.outbound import APIResponse
from app.core.security import verify_service_key
from app.core.utils import encode_slug
from app.db.models.profile import ProfileDB
from app.db.models.user import UserDB
from app.db.session import get_db
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from rich import print

from app.item.dependencies import resolve_item_slug_query
from app.item.dependencies.resolve_item_path import resolve_item_slug_path

chat_router = APIRouter(
    prefix="/api/chat",
    tags=["Chat"],
    dependencies=[Depends(verify_service_key)],
)


@chat_router.post("/peer/{peerHandle}/item/{itemSlug}")
async def get_room_slug(
    user: UserDB = Depends(resolve_firebase_session),
    peer_id: UUID = Depends(resolve_peer_user),
    item_id: UUID = Depends(resolve_item_slug_path),
    db: AsyncSession = Depends(get_db),
):
    room = await ChatRepository.get_room_by_user_and_peer(db, user.id, peer_id)

    room_slug = None
    if not room:
        room_id = await ChatService.create_room_with_users(user.id, peer_id)
        if not room_id:
            raise ErrorResponse(message="failed to create room with users")

        room = await ChatRepository.create(
            db,
            ChatRoomInDB(
                room_id=room_id,
                item_id=item_id,
                user_ids=[user.id, peer_id],
            ),
        )

        if not room:
            delete_id = await ChatService.delete_room(room_id)
            raise ErrorResponse(
                message=(
                    "failed to create db room"
                    + ("" if delete_id else " and delete synapse room")
                )
            )
        logger.info(f"Room {room_id} added to DB")

    room_slug = encode_slug(room.id)
    return APIResponse(data={"roomSlug": room_slug})


@chat_router.get("/messages/unread/count")
async def get_unread_messages_count(
    user: UserDB = Depends(resolve_firebase_session),
):
    access_token = await ChatService.get_access_token(user.id)
    if not access_token:
        raise ErrorResponse(message="failed to get access token")
    sync_data = await ChatService.sync_data(access_token)
    if not sync_data:
        raise ErrorResponse(message="failed to get sync data")
    total_unread = sum(
        room["unread_notifications"]["notification_count"]
        for room in sync_data["rooms"]["join"].values()
    )
    return APIResponse(data={"count": total_unread})
