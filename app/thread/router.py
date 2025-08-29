from app.auth.firebase.dependencies import resolve_firebase_session
from app.core.security import verify_service_key
from app.db.models.user import UserDB
from app.db.session import get_db
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

threads_router = APIRouter(
    prefix="/api/thread",
    tags=["Thread"],
    dependencies=[Depends(verify_service_key)],
)


@threads_router.get("")
async def get_thread(
    user: UserDB = Depends(resolve_firebase_session),
    db: AsyncSession = Depends(get_db),
):
    pass
