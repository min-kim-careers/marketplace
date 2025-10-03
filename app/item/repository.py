from typing import List, Optional, Sequence
from uuid import UUID

from fastapi import UploadFile

from app.core.helpers import get_one_by
from app.core.logger import log_class_exceptions
from app.db.models.item import ItemDB
from app.item.enums import ItemSortOrder, ItemStatus, ItemUserOption
from app.item.schemas.inbound import ItemInDB, ItemsQuery
from sqlalchemy import Select, String, and_, asc, cast, desc, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.item.utils.image import store_image, store_image_bulk


@log_class_exceptions
class ItemRepository:
    @staticmethod
    def _build_query(stmt: Select, query: ItemsQuery, user_id: Optional[UUID] = None):
        if query.keyword:
            or_conditions = [
                func.lower(ItemDB.name).ilike(f"%{query.keyword}%"),
                func.lower(ItemDB.description).ilike(f"%{query.keyword}%"),
                func.lower(cast(ItemDB.category, String)).ilike(f"%{query.keyword}%"),
            ]
            stmt = stmt.where(
                or_(*or_conditions),
            )

        if user_id:
            if query.user_option == ItemUserOption.exclude_user:
                stmt = stmt.where(
                    ItemDB.user_id != user_id,
                )
            elif query.user_option == ItemUserOption.user_only:
                stmt = stmt.where(
                    ItemDB.user_id == user_id,
                )

        if query.active_only:
            stmt = stmt.where(
                ItemDB.status.in_(
                    [
                        ItemStatus.available,
                        ItemStatus.pending,
                    ]
                )
            )

        if query.categories:
            stmt = stmt.where(ItemDB.category.in_(query.categories))

        if query.conditions:
            stmt = stmt.where(ItemDB.condition.in_(query.conditions))

        return stmt

    @staticmethod
    async def paginated(
        db: AsyncSession,
        query: ItemsQuery,
        user_id: Optional[UUID] = None,
    ) -> Sequence[ItemDB]:
        stmt = select(ItemDB)

        stmt = ItemRepository._build_query(stmt, query, user_id).where(
            ItemDB.status != ItemStatus.deleted
        )

        if query.sort_by:
            sort_column = getattr(ItemDB, query.sort_by.value)
            if query.sort_order == ItemSortOrder.asc:
                stmt = stmt.order_by(asc(sort_column))
            else:
                stmt = stmt.order_by(desc(sort_column))

        stmt = stmt.offset(query.offset).limit(query.limit)
        result = await db.execute(stmt)
        return result.scalars().all()

    @staticmethod
    async def count(
        db: AsyncSession,
        query: ItemsQuery,
        user_id: Optional[UUID] = None,
    ) -> int:
        stmt = select(func.count()).select_from(ItemDB)

        stmt = ItemRepository._build_query(stmt, query, user_id)

        result = await db.execute(stmt)

        return result.scalar_one()

    @staticmethod
    async def count_for_user(db: AsyncSession, user_id: UUID) -> int:
        stmt = select(func.count()).select_from(ItemDB).where(ItemDB.user_id == user_id)

        result = await db.execute(stmt)

        return result.scalar_one()

    @staticmethod
    async def by_id(db: AsyncSession, item_id: UUID) -> ItemDB:
        return await get_one_by(db, ItemDB, id=item_id)

    @staticmethod
    async def by_id_and_user(db: AsyncSession, user_id: UUID, item_id: UUID) -> ItemDB:
        return await get_one_by(db, ItemDB, user_id=user_id, id=item_id)

    @staticmethod
    async def by_ids_and_user(
        db: AsyncSession, item_ids: List[UUID]
    ) -> Sequence[ItemDB]:
        stmt = select(ItemDB).where(
            and_(
                ItemDB.id.in_(item_ids),
            )
        )
        result = await db.execute(stmt)
        return result.scalars().all()

    @staticmethod
    async def create_item(
        db: AsyncSession, user_id: UUID, item_in_db: ItemInDB
    ) -> ItemDB:
        try:
            item_db = ItemDB(
                **item_in_db.model_dump(),
                user_id=user_id,
            )

            db.add(item_db)
            await db.flush()
            await db.refresh(item_db)
            return item_db
        except Exception:
            await db.rollback()
            raise

    @staticmethod
    async def update_item(
        db: AsyncSession, item_db: ItemDB, item_in_db: ItemInDB
    ) -> ItemDB:
        try:
            for field, value in item_in_db.model_dump(
                exclude_unset=True, exclude_none=True
            ).items():
                if value:
                    setattr(item_db, field, value)

            await db.flush()
            await db.refresh(item_db)
            return item_db
        except Exception:
            await db.rollback()
            raise

    @staticmethod
    async def delete(db: AsyncSession, item_db: ItemDB) -> bool:
        try:
            await db.delete(item_db)
            await db.commit()
            return True
        except Exception:
            await db.rollback()
            raise

    @staticmethod
    async def create_images(
        db: AsyncSession,
        item_db: ItemDB,
        upload_images: list[UploadFile],
    ):
        try:
            updated_filenames = await store_image_bulk(upload_images)
            item_db.image_filenames = updated_filenames
            await db.flush()
            return item_db
        except Exception:
            await db.rollback()
            raise

    @staticmethod
    async def update_images(
        db: AsyncSession,
        item_db: ItemDB,
        upload_images: list[UploadFile],
        image_urls: list[str],
    ):
        try:
            updated_filenames = []

            upload_idx = 0
            for url in image_urls:
                if url.startswith("blob:"):
                    new_fn = await store_image(upload_images[upload_idx])
                    updated_filenames.append(new_fn)
                    upload_idx += 1
                else:
                    existing_fn = url.split("/")[-1]
                    updated_filenames.append(existing_fn)

            item_db.image_filenames = updated_filenames

            await db.flush()
            return item_db
        except Exception:
            await db.rollback()
            raise
