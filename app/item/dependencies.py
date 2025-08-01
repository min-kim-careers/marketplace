import base64
from typing import Annotated
from uuid import UUID

from fastapi import Depends, Form, Path, Query

from app.core.schemas.error import ErrorResponse
from app.core.utils import decode_slug
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.item import ItemDB
from app.db.session import get_db
from app.item.repository import ItemRepository
from app.item.schemas.inbound import ItemInForm
from app.item.service import ItemService
from app.profile.repository import ProfileRepository
from app.profile.schemas.outbound import ProfileExtra, ProfileOut
from app.profile.service import ProfileService


async def resolve_item(
    item_slug: str = Path(...),
    user_id: UUID = Path(...),
    db: AsyncSession = Depends(get_db),
) -> ItemDB:
    item_id = decode_slug(item_slug)
    item_db = await ItemRepository.get_by_item_and_user_id(db, user_id, item_id)
    if not item_db:
        raise ErrorResponse(status_code=404, message="Item not found")
    return item_db


def resolve_item_slug(item_slug: str = Query(None, alias="itemSlug")) -> UUID | None:
    if not item_slug:
        return None
    return decode_slug(item_slug)


async def resolve_upsert_item(
    item_in: Annotated[ItemInForm, Form()],
    user_id: UUID = Path(...),
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
    
    

