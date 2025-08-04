from app.auth.firebase.dependencies import resolve_firebase_session
from app.core.schemas.error import ErrorResponse
from app.core.utils import decode_slug
from app.db.models.item import ItemDB
from app.db.models.user import UserDB
from app.db.session import get_db
from app.item.repository import ItemRepository


from fastapi import Depends, Path
from sqlalchemy.ext.asyncio import AsyncSession


async def resolve_item(
    item_slug: str = Path(...),
    user: UserDB = Depends(resolve_firebase_session),
    db: AsyncSession = Depends(get_db),
) -> ItemDB:
    item_id = decode_slug(item_slug)
    item_db = await ItemRepository.get_by_item_and_user_id(db, user.id, item_id)
    if not item_db:
        raise ErrorResponse(status_code=404, message="Item not found")
    return item_db