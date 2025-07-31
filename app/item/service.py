import re
from typing import List
from uuid import UUID

from fastapi import UploadFile
from app.core.schemas.error import ErrorResponse
from app.item.models.item import ItemDB
from app.item.repositories.item import ItemRepository
from app.item.schemas.inbound import ItemInDB
from app.item.schemas.inbound import ItemInForm
from app.storage.image import store_image_bulk
from sqlalchemy.ext.asyncio import AsyncSession
from rich import print


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
        db: AsyncSession, user_id: UUID, item_in: ItemInForm, item_db: ItemDB | None
    ):
        item_in_db = ItemInDB.model_validate(item_in, from_attributes=True)

        new_item_db = None
        if item_db:
            print("Updating...")
            new_item_db = await ItemRepository.update(db, item_db, item_in_db)
        else:
            print("Creating...")
            new_item_db = await ItemRepository.create(db, user_id, item_in_db)

        return new_item_db
    

    