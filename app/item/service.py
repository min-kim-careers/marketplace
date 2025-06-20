import re
from typing import List
from uuid import UUID

from fastapi import UploadFile
from app.common.schemas.error import ErrorResponse
from app.db.models.item import ItemDB
from app.db.repositories.item import ItemRepository
from app.db.schemas.item import ItemInDB
from app.item.schemas.inbound import ItemIn
from app.storage.image import store_image_bulk
from sqlalchemy.ext.asyncio import AsyncSession


class ItemService:
    @staticmethod
    async def upload_images_and_get_urls(
        upload_images: List[UploadFile], image_urls: List[str]
    ) -> List[str] | None:
        new_urls = await store_image_bulk(upload_images)
        if not new_urls:
            return None

        for image_url_index, existing_url in enumerate(image_urls):
            match = re.match(r"^\{\{(\d+)\}\}$", existing_url)
            if match:
                placeholder_index = int(match.group(1))
                image_urls[image_url_index] = new_urls[placeholder_index]
        return new_urls

    @staticmethod
    async def upsert_item(
        session: AsyncSession, user_id: UUID, item_in: ItemIn, item_db: ItemDB | None
    ):
        item_in_db = ItemInDB.model_validate(item_in, from_attributes=True)

        new_item_db = None
        if item_db:
            new_item_db = await ItemRepository.update_item(session, item_db, item_in_db)
        else:
            new_item_db = await ItemRepository.create_item(session, user_id, item_in_db)

        return new_item_db
