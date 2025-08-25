import asyncio
from typing import Any, Callable, Optional
import uuid
import httpx
from app.chat.helpers.handle_raise_for_status import handle_raise_for_status
from app.cache.stores import admin_token_store, token_store
from app.chat.helpers.create_mac import create_mac
from app.chat.helpers.get_nonce import get_nonce
from app.chat.schemas.synapse.inbound import (
    SynapseLoginResponse,
    SynapseRegisterResponse,
)
from app.core import logger
from app.core import env_loader
from app.chat.schemas.outbound import MessageOut
from app.db.models.user import UserDB

SYNAPSE_URL = env_loader.SYNAPSE_URL


class ChatService:
    @staticmethod
    async def register_new_user(
        user_id: str, admin=False
    ) -> Optional[SynapseRegisterResponse]:
        new_user = None

        try:
            username = password = user_id

            nonce = await get_nonce()
            mac = create_mac(nonce, username, password, admin)

            payload = {
                "nonce": nonce,
                "username": username,
                "password": password,
                "admin": admin,
                "mac": mac,
            }

            async with httpx.AsyncClient() as client:
                r = await client.post(
                    f"{SYNAPSE_URL}/_synapse/admin/v1/register",
                    json=payload,
                )
                handle_raise_for_status(r)

                new_user = SynapseRegisterResponse.model_validate(r.json())

            return new_user
        except Exception as e:
            logger.error(e)

    @staticmethod
    async def delete_user(user_id: str):
        admin_token = await ChatService.admin_access_token()

        try:
            async with httpx.AsyncClient() as client:
                await client.post(
                    f"{SYNAPSE_URL}/_synapse/admin/v1/deactivate/{user_id}",
                    headers={
                        "Authorization": f"Bearer {admin_token}"
                    },
                    json={"erase": True},
                )
        except Exception as e:
            logger.error(e)

    @staticmethod
    async def login(user_id: str) -> Optional[SynapseLoginResponse]:
        try:
            async with httpx.AsyncClient() as client:
                r = await client.post(
                    f"{SYNAPSE_URL}/_matrix/client/v3/login",
                    json={
                        "type": "m.login.password",
                        "user": user_id,
                        "password": user_id,
                    },
                )
                return SynapseLoginResponse.model_validate(r.json())
        except Exception as e:
            logger.error(e)

    @staticmethod
    async def access_token(user_id: str):
        token = token_store.get_token(user_id)
        if token:
            return token
        data = await ChatService.login(user_id)
        if data:
            token = data.access_token
            token_store.set_token(user_id, token)
            return token

    @staticmethod
    async def admin_access_token():
        token = admin_token_store.get_admin_token()
        if token:
            return token
        data = await ChatService.login(admin_token_store.admin_user)
        if data:
            token = data.access_token
            admin_token_store.set_admin_token(token)
            return token

    @staticmethod
    async def sync_data(access_token: str, since=None):
        try:
            async with httpx.AsyncClient() as client:
                params = {
                    "access_token": access_token,
                    "timeout": 30000,
                }
                if since:
                    params["since"] = since

                r = await client.get(
                    f"{SYNAPSE_URL}/_matrix/client/v3/sync",
                    params=params,
                )
                handle_raise_for_status(r)
                return r.json()
        except httpx.ReadTimeout:
            pass
        except Exception as e:
            logger.error(e)

    @staticmethod
    async def send_message(access_token: str, room_id: str, message: str):
        try:
            async with httpx.AsyncClient() as client:
                txn_id = str(uuid.uuid4())
                r = await client.put(
                    f"{SYNAPSE_URL}/_matrix/client/v3/rooms/{room_id}/send/m.room.message/{txn_id}",
                    headers={"Authorization": f"Bearer {access_token}"},
                    json={"msgtype": "m.text", "body": message},
                )
                handle_raise_for_status(r)
                logger.info(f"message sent: {message}")
                return r.json()
        except Exception as e:
            logger.error(e)

    @staticmethod
    async def create_room(invite: Optional[list[str]] = None) -> str | None:
        admin_token = await ChatService.admin_access_token()

        try:
            payload = {}
            if invite:
                payload["invite"] = invite

            async with httpx.AsyncClient() as client:
                r = await client.post(
                    f"{SYNAPSE_URL}/_matrix/client/v3/createRoom",
                    headers={
                        "Authorization": f"Bearer {admin_token}"
                    },
                    json=payload,
                )
                handle_raise_for_status(r)
                return r.json()["room_id"]

        except Exception as e:
            logger.error(e)

    @staticmethod
    async def join_room(access_token: str, room_id: str) -> str | None:
        try:
            async with httpx.AsyncClient() as client:
                r = await client.post(
                    f"{SYNAPSE_URL}/_matrix/client/v3/join/{room_id}",
                    headers={"Authorization": f"Bearer {access_token}"},
                    json={},
                )
                handle_raise_for_status(r)
                return r.json()["room_id"]
        except Exception as e:
            logger.error(e)

    @staticmethod
    async def create_room_with_users(
        user_1_db: UserDB,
        user_2_db: UserDB,
    ):
        room_id = None
        try:

            async def create_room():
                room_id = await ChatService.create_room(
                    invite=[
                        user_1_db.chat_user_id,
                        user_2_db.chat_user_id,
                    ]
                )
                return room_id

            async def get_access_tokens(user_1_id: uuid.UUID, user_2_id: uuid.UUID):
                access_token_1, access_token_2 = await asyncio.gather(
                    ChatService.access_token(str(user_1_id)),
                    ChatService.access_token(str(user_2_id)),
                )
                return access_token_1, access_token_2

            async def join_rooms(access_token_1, access_token_2, room_id):
                room_id_1, room_id_2 = await asyncio.gather(
                    ChatService.join_room(access_token_1, room_id),
                    ChatService.join_room(access_token_2, room_id),
                )
                if room_id_1 and room_id_2:
                    return room_id

            async def create_filters(
                access_token_1: str,
                user_id_1: str,
                access_token_2: str,
                user_id_2,
                room_id: str,
            ):
                user_1_filter, user_2_filter = await asyncio.gather(
                    ChatService.create_room_filter(access_token_1, user_id_1, room_id),
                    ChatService.create_room_filter(access_token_2, user_id_2, room_id),
                )
                return user_1_filter, user_2_filter

            room_id = await create_room()
            if not room_id:
                raise Exception("failed to create room")

            access_token_1, access_token_2 = await get_access_tokens(
                user_1_db.id, user_2_db.id
            )
            if not access_token_1 or not access_token_2:
                raise Exception("failed to get access tokens for users")

            room_id = await join_rooms(access_token_1, access_token_2, room_id)
            if not room_id:
                raise Exception("failed to join room")

            user_1_filter, user_2_filter = await create_filters(
                access_token_1,
                user_1_db.chat_user_id,
                access_token_2,
                user_2_db.chat_user_id,
                room_id,
            )
            if not user_1_filter or not user_2_filter:
                raise Exception("failed to create room filters")

            return {
                "room_id": room_id,
                "user_1_filter_id": user_1_filter,
                "user_2_filter_id": user_2_filter,
            }
        except Exception as e:
            logger.error(e)
            if room_id:
                if not await ChatService.delete_room(room_id):
                    logger.error("failed to delete room")

    @staticmethod
    async def delete_room(room_id: str) -> str | None:
        admin_token = await ChatService.admin_access_token()

        try:
            async with httpx.AsyncClient() as client:
                r = await client.request(
                    "DELETE",
                    f"{SYNAPSE_URL}/_synapse/admin/v1/rooms/{room_id}",
                    headers={
                        "Authorization": f"Bearer {admin_token}"
                    },
                    json={},
                )
                handle_raise_for_status(r)
                return r.json()["delete_id"]
        except Exception as e:
            logger.error(e)

    @staticmethod
    async def create_room_filter(access_token: str, user_id: str, room_id: str):
        try:
            url = f"{SYNAPSE_URL}/_matrix/client/v3/user/{user_id}/filter"
            headers = {"Authorization": f"Bearer {access_token}"}
            payload = {
                "room": {
                    "rooms": [room_id],
                    "timeline": {"types": ["m.room.message"]},
                    "ephemeral": {"types": ["m.typing", "m.receipt"]},
                    # "state": {"types": ["m.room.member", "m.room.topic"]},
                }
            }
            async with httpx.AsyncClient() as client:
                r = await client.post(
                    url,
                    headers=headers,
                    json=payload,
                )
                handle_raise_for_status(r)
                return r.json()["filter_id"]
        except Exception as e:
            logger.error(e)
