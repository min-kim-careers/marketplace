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
                    f"{SYNAPSE_URL}/_matrix/client/r0/login",
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
                    f"{SYNAPSE_URL}/_matrix/client/r0/refresh",
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
                params = {"access_token": access_token, "timeout": 30000}
                if since:
                    params["since"] = since

                r = await client.get(
                    f"{SYNAPSE_URL}/_matrix/client/r0/sync",
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
                    f"{SYNAPSE_URL}/_matrix/client/r0/rooms/{room_id}/send/m.room.message/{txn_id}",
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
                    f"{SYNAPSE_URL}/_matrix/client/r0/createRoom",
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
                    f"{SYNAPSE_URL}/_matrix/client/r0/join/{room_id}",
                    headers=({"Authorization": f"Bearer {access_token}"}),
                    json={},
                )
                r.raise_for_status()
                return r.json()["room_id"]
        except Exception as e:
            logger.error(e)

    @staticmethod
    async def create_room_with_users(
        user_1: uuid.UUID,
        user_2: uuid.UUID,
    ) -> str | None:
        _user_1, _user_2 = await asyncio.gather(
            ChatService.login(user_1),
            ChatService.login(user_2),
        )

        if not _user_1 or not _user_2:
            logger.error(f"failed to get login a user")
            return

        room_id = await ChatService.create_room(
            invite=[
                _user_1.user_id,
                _user_2.user_id,
            ]
        )
        if not room_id:
            logger.error("failed to create room")
            return

        res = await asyncio.gather(
            ChatService.join_room(_user_1.access_token, room_id),
            ChatService.join_room(_user_2.access_token, room_id),
        )
        if None in res:
            logger.error("failed to join room")
            return

        room_id = res[0]

        return room_id

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

    @staticmethod
    async def room_history(access_token: str, room_id: str, chat_id: str):
        try:
            url = f"{SYNAPSE_URL}/_matrix/client/r0/rooms/{room_id}/messages"
            headers = {"Authorization": f"Bearer {access_token}"}
            params = {
                "dir": "b",
                "limit": 50,
            }
            async with httpx.AsyncClient() as client:
                resp = await client.get(
                    url,
                    headers=headers,
                    params=params,
                )
                resp.raise_for_status()
                print()
                data = resp.json()["chunk"]
                return [
                    MessageOut.parse_matrix_data(e, chat_id).model_dump()
                    for e in data
                    if e["type"] == "m.room.message"
                ]
        except Exception as e:
            logger.error(e)
