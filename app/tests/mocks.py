import asyncio
from datetime import datetime
from uuid import UUID, uuid4
from faker import Faker
from sqlalchemy import select
from app.core import logger
from app.db.models.profile_extra import ProfileExtraDB
from app.db.models.user import UserDB
from app.core.utils import get_one_by
from app.db.session import get_db
from app.item.enums import ItemCategory, ItemCondition
from app.db.models.item import ItemDB
from app.db.models.profile import ProfileDB
import random

from app.profile.constants.defaults import default_profile_extra


fake = Faker(locale="en_AU")


def create_mock_user() -> UserDB:
    return UserDB(
        provider_name="firebase",
        provider_id=str(uuid4()),
    )


def create_mock_profile(user_id: UUID) -> ProfileDB:
    return ProfileDB(
        user_id=user_id,
        email=fake.unique.email(),
        handle=fake.unique.user_name(),
        rating=round(random.uniform(1, 5), 2),
        rating_count=random.randint(0, 1000),
        postcode=fake.postcode(),
        suburb=fake.city(),
        state=fake.state(),
        avatar_url=fake.image_url(),
        extra=default_profile_extra(),
    )


def create_mock_item(user_id: UUID) -> ItemDB:
    return ItemDB(
        user_id=user_id,
        name=fake.name().capitalize(),
        description=fake.text(max_nb_chars=200),
        price=round(random.uniform(10, 1000), 2),
        brand=fake.company(),
        category=random.choice(list(ItemCategory)),
        condition=random.choice(list(ItemCondition)),
        postcode=fake.postcode(),
        suburb=fake.city(),
        state=fake.state(),
        # image_urls=[fake.image_url() for _ in range(random.randint(0, 3))],
    )



async def seed_db():
    async for db in get_db():
        res = await db.execute(select(ProfileDB))
        if res.first():
            return

        mock_users = [create_mock_user() for _ in range(5)]
        db.add_all(mock_users)
        await db.commit()

        mock_profiles = [create_mock_profile(user.id) for user in mock_users]
        db.add_all(mock_profiles)
        await db.commit()

        for user in mock_users:
            mock_items = [create_mock_item(user.id) for _ in range(4)]
            db.add_all(mock_items)
            await db.commit()

        logger.info("Seeding complete.")


async def seed_user_items(email, count):
    async for db in get_db():
        profile = await get_one_by(db, ProfileDB, email=email)
        if not profile:
            raise ValueError("Profile not found")
        items = [
            create_mock_item(
                user_id=profile.user_id,
            )
            for _ in range(count)
        ]
        db.add_all(items)
        await db.commit()
        logger.info("User items seeded.")


if __name__ == "__main__":
    asyncio.run(
        seed_user_items(
            "user1@example.com",
            3,
        ),
    )
    asyncio.run(
        seed_user_items(
            "user2@example.com",
            3,
        ),
    )
