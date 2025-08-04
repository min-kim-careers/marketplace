import re
from typing import List, Optional
from uuid import UUID

from fastapi import UploadFile
from app.core.schemas.error import ErrorResponse
from app.db.models.item import ItemDB
from app.item.repository import ItemRepository
from app.item.schemas.inbound import ItemInDB, ItemsQuery
from app.item.schemas.inbound import ItemInForm
from app.item.schemas.outbound import ItemOut, ItemResponse
from app.storage.image import remove_image_bulk, store_image_bulk
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

    @staticmethod
    async def get_items(
        db: AsyncSession, query: ItemsQuery, user_id: Optional[UUID] = None
    ):
        item_count = await ItemRepository.get_queried_count(db, query, user_id)
        if not item_count:
            return ItemResponse(
                data={
                    "items": [],
                    "count": 0,
                }
            )

        items_db = await ItemRepository.get_queried_paginated(db, query, user_id)
        if not items_db:
            raise ErrorResponse(
                status_code=500,
                message="Error querying item count",
            )

        return ItemResponse(
            data={
                "items": [ItemOut.from_db(item) for item in items_db],
                "count": item_count,
            },
        )

    @staticmethod
    async def delete_item(db: AsyncSession, item_db: ItemDB):
        image_urls_copy = list(item_db.image_urls)

        if not await ItemRepository.delete(db, item_db):
            raise ErrorResponse(status_code=404, message="Failed to delete item")

        remove_image_bulk(image_urls_copy)
