from typing import Optional
from uuid import UUID

from app.core.logger import log_class_exceptions, logger
from app.core.schemas.error import ErrorResponse
from app.core.schemas.outbound import APIResponse
from app.db.models.item import ItemDB
from app.item.repository import ItemRepository
from app.item.schemas.inbound import ItemInDB, ItemInForm, ItemsQuery
from app.item.schemas.outbound import ItemOut
from app.item.utils.image import remove_image_bulk
from sqlalchemy.ext.asyncio import AsyncSession
from rich import print


@log_class_exceptions
class ItemService:

    @staticmethod
    async def upsert_item(
        db: AsyncSession, user_id: UUID, item_form: ItemInForm, item_db: ItemDB | None
    ):
        print(item_form)
        is_updating = bool(item_db)

        try:
            if is_updating:
                logger.info("Updating...")
                item_db = await ItemRepository.update_item(
                    db,
                    item_db,
                    ItemInDB.model_validate(item_form, from_attributes=True),
                )
                item_db = await ItemRepository.update_images(
                    db,
                    item_db,
                    item_form.upload_images,
                    item_form.image_urls,
                )

            else:
                logger.info("Creating...")
                item_db = await ItemRepository.create_item(
                    db,
                    user_id,
                    ItemInDB.model_validate(item_form, from_attributes=True),
                )
                item_db = await ItemRepository.create_images(
                    db, item_db, item_form.upload_images
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
        filenames = item_db.image_filenames
        await ItemRepository.delete(db, item_db)
        remove_image_bulk(filenames)
