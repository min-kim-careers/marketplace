from app.core.schemas.error import ErrorResponse
from app.db.session import get_db
from app.item.repository import ItemRepository
from app.item.schemas.inbound import ItemInForm
from app.profile.service import ProfileService


from fastapi import Depends, Form, Path
from sqlalchemy.ext.asyncio import AsyncSession


from typing import Annotated
from uuid import UUID


async def resolve_upsert_item(
    item_in: Annotated[ItemInForm, Form()],
    user_id: UUID = Path(alias='userId'),
    db: AsyncSession = Depends(get_db),
):
    extra = await ProfileService.get_profile_extra(db, user_id)
    if not extra:
        raise ErrorResponse(status_code=500, message="No profile extra found")

    user_item_count = await ItemRepository.get_item_count_for_user(db, user_id)

    if user_item_count + 1 > extra.listing_limit:
        raise ErrorResponse(status_code=500, message="Exceeded user item limit")

    if item_in.image_urls and len(item_in.image_urls) > extra.image_limit:
        raise ErrorResponse(status_code=500, message="Exceeded item image limit")