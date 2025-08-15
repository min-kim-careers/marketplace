import hashlib
import hmac
import uuid
import httpx
from app.core.config import env_loader

SYNAPSE_URL = env_loader.SYNAPSE_URL


async def get_nonce():
    async with httpx.AsyncClient() as client:
        r = await client.get(f"{SYNAPSE_URL}/_synapse/admin/v1/register")
        r.raise_for_status()
        return r.json()["nonce"]


def create_mac(
    nonce,
    username,
    password,
    admin=False,
):
    message = b"\0".join(
        [
            nonce.encode("utf-8"),
            username.encode("utf-8"),
            password.encode("utf-8"),
            b"admin" if admin else b"notadmin",
        ]
    )
    mac = hmac.new(
        env_loader.SYNAPSE_SHARED_SECRET.encode("utf-8"),
        message,
        hashlib.sha1,
    )
    return mac.hexdigest()


class ChatService:
    @staticmethod
    async def register_user(username: str, password: str, admin=False):
        try:
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
            print(e)

    @staticmethod
    async def get_access_token(username, password):
        try:
            async with httpx.AsyncClient() as client:
                r = await client.post(
                    f"{SYNAPSE_URL}/_matrix/client/r0/login",
                    json={
                        "type": "m.login.password",
                        "user": username,
                        "password": password,
                    },
                )
                data = r.json()
                return data["access_token"]
        except Exception as e:
            print(e)

    @staticmethod
    async def sync_data(access_token, since=None):
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
        except Exception as e:
            print(e)

    @staticmethod
    async def send_message(access_token, room_id, message):
        try:
            async with httpx.AsyncClient() as client:
                txn_id = str(uuid.uuid4())  # unique transaction ID

                r = await client.put(
                    f"{SYNAPSE_URL}/_matrix/client/r0/rooms/{room_id}/send/m.room.message/{txn_id}",
                    headers={"Authorization": f"Bearer {access_token}"},
                    json={"msgtype": "m.text", "body": message},
                )
                r.raise_for_status()
                return r.json()
        except Exception as e:
            print(e)

    @staticmethod
    async def create_room(access_token) -> str | None:
        try:
            async with httpx.AsyncClient() as client:
                r = await client.post(
                    f"{SYNAPSE_URL}/_matrix/client/r0/create/r0/createRoom",
                    headers=({"Authorization": f"Bearer {access_token}"}),
                    json={},
                )
                r.raise_for_status()
                return r.json()["room_id"]
        except Exception as e:
            print(e)

    @staticmethod
    async def delete_room(room_id) -> str | None:
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
            print(e)

    @staticmethod
    async def fetch_room_history(access_token: str, room_id: str):
        try:
            url = f"{SYNAPSE_URL}/_matrix/client/r0/rooms/{room_id}/messages"
            headers = {"Authorization": f"Bearer {access_token}"}
            params = {
                "dir": "b",
                "limit": 50,
            }
            async with httpx.AsyncClient() as client:
                resp = await client.get(url, headers=headers, params=params)
                resp.raise_for_status()
                return resp.json()
        except Exception as e:
            print(e)
