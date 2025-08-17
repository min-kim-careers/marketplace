import httpx

from app.core import env_loader


async def get_nonce():
    async with httpx.AsyncClient() as client:
        r = await client.get(f"{env_loader.SYNAPSE_URL}/_synapse/admin/v1/register")
        r.raise_for_status()
        return r.json()["nonce"]
