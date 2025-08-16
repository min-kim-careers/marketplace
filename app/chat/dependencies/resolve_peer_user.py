from app.core.schemas.error import ErrorResponse
from app.db.session import get_db
from app.profile.repository import ProfileRepository


from fastapi import Depends, Path
from sqlalchemy.ext.asyncio import AsyncSession


from uuid import UUID


async def resolve_peer_user(
    peer_handle: str = Path(..., alias="peerHandle"),
    db: AsyncSession = Depends(get_db),
) -> UUID:
    peer = await ProfileRepository.get_by_handle(db, peer_handle)
    if not peer:
        raise ErrorResponse(status_code=401, message="peer handle not found")
    return peer.user_id