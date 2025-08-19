import asyncio
from typing import Optional
import uuid
import httpx
from app.chat.utils import token_store
from app.chat.helpers.create_mac import create_mac
from app.chat.helpers.get_nonce import get_nonce
from app.chat.schemas.synapse.inbound import SynapseLoginResponse
from app.core import logger
from app.core import env_loader
from app.chat.schemas.outbound import MessageOut
from app.db.models.user import UserDB

SYNAPSE_URL = env_loader.SYNAPSE_URL


class ChatService:
    @staticmethod
    async def register_new_user(user_id: uuid.UUID, admin=False):
        try:
            username = password = str(user_id)

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
                r.raise_for_status()
                return r.json()
        except Exception as e:
            logger.error(e)

    @staticmethod
    async def login(user_id: uuid.UUID) -> Optional[SynapseLoginResponse]:
        try:
            async with httpx.AsyncClient() as client:
                r = await client.post(
                    f"{SYNAPSE_URL}/_matrix/client/v3/login",
                    json={
                        "type": "m.login.password",
                        "user": str(user_id),
                        "password": str(user_id),
                    },
                )
                return SynapseLoginResponse.model_validate(r.json())
        except Exception as e:
            logger.error(e)

    @staticmethod
    async def access_token(user_id: uuid.UUID):
        token = token_store.get_token(user_id)
        if token:
            return token
        data = await ChatService.login(user_id)
        if data:
            token = data.access_token
            token_store.set_token(user_id, token)
            return token

    @staticmethod
    async def refresh_token(access_token: str, refresh_token: str):
        try:
            async with httpx.AsyncClient() as client:
                r = await client.post(
                    f"{SYNAPSE_URL}/_matrix/client/v3/refresh",
                    headers={"Authorization": f"Bearer {access_token}"},
                    json={"refresh_token": refresh_token},
                )
                data = r.json()
                return data
        except Exception as e:
            logger.error(e)

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
                r.raise_for_status()
                return r.json()
        except httpx.ReadTimeout:
            pass
        except Exception as e:
            logger.error(e)

    @staticmethod
    async def send_message(access_token: str, room_id: str, message: str):
        try:
            async with httpx.AsyncClient() as client:
                txn_id = str(uuid.uuid4())  # unique transaction ID
                r = await client.put(
                    f"{SYNAPSE_URL}/_matrix/client/v3/rooms/{room_id}/send/m.room.message/{txn_id}",
                    headers={"Authorization": f"Bearer {access_token}"},
                    json={"msgtype": "m.text", "body": message},
                )
                r.raise_for_status()
                logger.info(f"message sent: {message}")
                return r.json()
        except Exception as e:
            logger.error(e)

    @staticmethod
    async def create_room(invite: Optional[list[str]] = None) -> str | None:
        try:
            payload = {}
            if invite:
                payload["invite"] = invite

            async with httpx.AsyncClient() as client:
                r = await client.post(
                    f"{SYNAPSE_URL}/_matrix/client/v3/createRoom",
                    headers=(
                        {"Authorization": f"Bearer {env_loader.SYNAPSE_ADMIN_TOKEN}"}
                    ),
                    json=payload,
                )
                r.raise_for_status()
                return r.json()["room_id"]

        except Exception as e:
            logger.error(e)

    @staticmethod
    async def join_room(access_token: str, room_id: str) -> str | None:
        try:
            async with httpx.AsyncClient() as client:
                r = await client.post(
                    f"{SYNAPSE_URL}/_matrix/client/v3/join/{room_id}",
                    headers=({"Authorization": f"Bearer {access_token}"}),
                    json={},
                )
                r.raise_for_status()
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
                        user_1_db.chat_id,
                        user_2_db.chat_id,
                    ]
                )
                return room_id

            async def get_access_tokens(user_1_id: uuid.UUID, user_2_id: uuid.UUID):
                access_token_1, access_token_2 = await asyncio.gather(
                    ChatService.access_token(user_1_id),
                    ChatService.access_token(user_2_id),
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
                user_1_db.chat_id,
                access_token_2,
                user_2_db.chat_id,
                room_id,
            )
            if not user_1_filter or not user_2_filter:
                raise Exception("failed to create room filters")

            return {
                "room_id": room_id,
                "user_1_filter": user_1_filter,
                "user_2_filter": user_2_filter,
            }
        except Exception as e:
            logger.error(e)
            if room_id:
                if not await ChatService.delete_room(room_id):
                    logger.error("failed to delete room")

    @staticmethod
    async def delete_room(room_id: str) -> str | None:
        try:
            async with httpx.AsyncClient() as client:
                r = await client.delete(
                    f"{SYNAPSE_URL}/_synapse/admin/v2/rooms/{room_id}",
                    headers=(
                        {"Authorization": f"Bearer {env_loader.SYNAPSE_ADMIN_TOKEN}"}
                    ),
                )
                r.raise_for_status()
                return r.json()["delete_id"]
        except Exception as e:
            logger.error(e)

    # @staticmethod
    # async def room_history(access_token: str, room_id: str, chat_id: str):
    #     try:
    #         url = f"{SYNAPSE_URL}/_matrix/client/v3/rooms/{room_id}/messages"
    #         headers = {"Authorization": f"Bearer {access_token}"}
    #         params = {
    #             "dir": "b",
    #             "limit": 50,
    #         }
    #         async with httpx.AsyncClient() as client:
    #             resp = await client.get(
    #                 url,
    #                 headers=headers,
    #                 params=params,
    #             )
    #             resp.raise_for_status()
    #             print()
    #             data = resp.json()["chunk"]
    #             return [
    #                 MessageOut.parse_matrix_data(e, chat_id).model_dump()
    #                 for e in data
    #                 if e["type"] == "m.room.message"
    #             ]
    #     except Exception as e:
    #         logger.error(e)

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
                resp = await client.post(
                    url,
                    headers=headers,
                    json=payload,
                )
                resp.raise_for_status()
                return resp.json()["filter_id"]
        except Exception as e:
            logger.error(e)
