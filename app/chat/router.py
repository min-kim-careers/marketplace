import json
from typing import Dict, List
from uuid import UUID

import httpx
from app.auth.firebase.dependencies import (
    resolve_firebase_query_token,
    resolve_firebase_session,
)
from app.cache.stores import notification_store
from app.cache.stores.unread_count_store import UnreadCountStore
from app.chat.dependencies.resolve_peer_user import resolve_peer_user
from app.chat.repository import ChatRepository
from app.chat.schemas.inbound import ChatRoomInDB
from app.chat.service import ChatService
from app.chat.websocket.websocket import chat_ws_router
from app.core import logger
from app.core import env_loader
from app.core.schemas.error import ErrorResponse
from app.core.schemas.outbound import APIResponse
from app.core.security import verify_service_key
from app.core.helpers import encode_slug, json_print
from app.db.models.profile import ProfileDB
from app.db.models.user import UserDB
from app.db.session import get_db
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from rich import print, print_json

from app.item.dependencies.resolve_item_path import resolve_item_slug_path

chat_router = APIRouter(
    prefix="/api/chat",
    tags=["Chat"],
    dependencies=[Depends(verify_service_key)],
)


@chat_router.post("/peer/{peerHandle}/item/{itemSlug}")
async def get_room_slug(
    user: UserDB = Depends(resolve_firebase_session),
    peer: UserDB = Depends(resolve_peer_user),
    item_id: UUID = Depends(resolve_item_slug_path),
    db: AsyncSession = Depends(get_db),
):
    room = await ChatRepository.get_room_by_user_and_peer(db, user.id, peer.id)

    room_slug = None
    if not room:
        res = await ChatService.create_room_with_users(user, peer)
        if not res:
            raise ErrorResponse(message="failed to create room with users")

        room_id = res["room_id"]
        room = await ChatRepository.create(
            db,
            ChatRoomInDB(
                **res,
                item_id=item_id,
                user_1_id=user.id,
                user_2_id=peer.id,
            ),
        )

        if not room:
            delete_id = await ChatService.delete_room(room_id)
            raise ErrorResponse(
                message=(
                    "failed to create db room"
                    + ("" if delete_id else " and clean up synapse room")
                )
            )
        logger.info(f"Room {room_id} added to DB")

    room_slug = encode_slug(room.id)
    return APIResponse(data={"roomSlug": room_slug})


@chat_router.get("/messages/unread/count")
async def get_unread_messages_count(
    user: UserDB = Depends(resolve_firebase_session),
):
    access_token = await ChatService.access_token(user.id)
    if not access_token:
        raise ErrorResponse(message="failed to get access token")

    sync_data = await ChatService.sync_data(access_token)
    if not sync_data:
        raise ErrorResponse(message="failed to get sync data")

    unread_count = notification_store.unread_count(user, sync_data)

    return APIResponse(data={"count": unread_count})
