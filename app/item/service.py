from typing import Optional
from uuid import UUID

from app.core.logger import log_class_exceptions, logger
from app.core.schemas.error import ErrorResponse
from app.core.schemas.outbound import APIResponse
from app.db.models.item import ItemDB, ItemImageDB
from app.item.repository import ItemRepository
from app.item.schemas.inbound import ItemInDB, ItemInForm, ItemsQuery
from app.item.schemas.outbound import ItemOut
from app.item.utils.image import store_image, remove_image_bulk
from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession


@log_class_exceptions
class ItemService:
    @staticmethod
    async def update_item_images(
        db: AsyncSession,
        item_db: ItemDB,
        upload_images: list[UploadFile] | None,
        upload_indices: list[int] | None,
    ):
        if not upload_images or not upload_indices:
            return item_db

        await db.refresh(item_db, attribute_names=["images"])
        existing = {img.index: img for img in item_db.images}

        for upload, idx in zip(upload_images, upload_indices):
            filename = await store_image(upload)
            if idx in existing:
                existing[idx].filename = filename
            else:
                new_img = ItemImageDB(index=idx, filename=filename, item_id=item_db.id)
                db.add(new_img)

        await db.flush()
        await db.refresh(item_db, attribute_names=["images"])
        return item_db

    @staticmethod
    async def upsert_item(
        db: AsyncSession, user_id: UUID, item_form: ItemInForm, item_db: ItemDB | None
    ):
        try:
            if item_db:
                logger.info("Updating...")
                item_db = await ItemRepository.update(
                    db,
                    item_db,
                    ItemInDB.model_validate(item_form, from_attributes=True),
                )
            else:
                logger.info("Creating...")
                item_db = await ItemRepository.create(
                    db,
                    user_id,
                    ItemInDB.model_validate(item_form, from_attributes=True),
                )

            item_db = await ItemService.update_item_images(
                db, item_db, item_form.upload_images, item_form.upload_indices
            )

            await db.commit()
            return item_db
        except Exception:
            await db.rollback()
            raise

    @staticmethod
    async def get_items(
        db: AsyncSession, query: ItemsQuery, user_id: Optional[UUID] = None
    ):
        item_count = await ItemRepository.count(db, query, user_id)
        if not item_count:
            return APIResponse(
                data={
                    "items": [],
                    "count": 0,
                }
            )

        items_db = await ItemRepository.paginated(db, query, user_id)
        if not items_db:
            raise ErrorResponse(
                status_code=500,
                message="Error querying item count",
            )

        items = [ItemOut.from_db(item) for item in items_db]

        return APIResponse(
            data={
                "items": items,
                "count": item_count,
            },
        )

    @staticmethod
    async def delete_item(db: AsyncSession, item_db: ItemDB):
        filenames = [img.filename for img in item_db.images]
        await ItemRepository.delete(db, item_db)
        remove_image_bulk(filenames)
