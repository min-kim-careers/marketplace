import asyncio
import random
import sys
from uuid import UUID, uuid4

from app.core.logger import logger
from app.db.models.item import ItemDB
from app.db.models.profile import ProfileDB
from app.db.models.user import UserDB
from app.db.session import get_db
from app.item.enums import ItemCategory, ItemCondition
from app.profile.constants.defaults import default_profile_extra
from faker import Faker
from sqlalchemy import select

fake = Faker(locale="en_AU")


def create_mock_user() -> UserDB:
    return UserDB(
        provider_name="mock",
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


async def seed_db(user_count: int = 5, items_per_user: int = 4):
    async for db in get_db():
        mock_users = [create_mock_user() for _ in range(user_count)]
        db.add_all(mock_users)
        await db.commit()

        mock_profiles = [create_mock_profile(user.id) for user in mock_users]
        db.add_all(mock_profiles)
        await db.commit()

        for user in mock_users:
            mock_items = [create_mock_item(user.id) for _ in range(items_per_user)]
            db.add_all(mock_items)
        await db.commit()

        logger.info(
            f"Seeding complete: {user_count} mock users, "
            f"{items_per_user} items each."
        )


async def seed_user_items(email, count):
    async for db in get_db():
        res = await db.execute(select(ProfileDB).where(ProfileDB.email == email))
        profile = res.scalar_one_or_none()
        if not profile:
            logger.warning(f"Profile {email} not found, skipping item seeding.")
            return
        items = [
            create_mock_item(
                user_id=profile.user_id,
            )
            for _ in range(count)
        ]
        db.add_all(items)
        await db.commit()
        logger.info(f"User {email} items seeded.")


async def main():
    # Usage: python app/tests/mocks.py [user_count] [items_per_user]
    user_count = int(sys.argv[1]) if len(sys.argv) > 1 else 5
    items_per_user = int(sys.argv[2]) if len(sys.argv) > 2 else 4
    await seed_db(user_count, items_per_user)


if __name__ == "__main__":
    asyncio.run(main())
