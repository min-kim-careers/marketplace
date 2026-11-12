from fastapi import APIRouter, Body
import httpx

from app.auth.helpers.create_nonce import create_nonce
from app.core import env
from app.core.schemas.error import ErrorResponse
from app.core.schemas.outbound import APIResponse


cloudflare_router = APIRouter(prefix="/auth/cloudflare", tags=["Auth - Cloudflare"])


@cloudflare_router.post("/verify-challenge")
async def verify_challenge(cf_token: str = Body(..., embed=True, alias="cfToken")):
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            env.TURNSTILE_URL,
            data={"secret": env.CF_TURNSTILE_SECRET, "response": cf_token},
        )
        result = resp.json()

    if not result.get("success"):
        raise ErrorResponse(status_code=403, message="Challenge failed")

    nonce = create_nonce(minutes=env.NONCE_LIFETIME_MINUTES)

    return APIResponse(data={"nonce": nonce})
