import asyncio
from uuid import UUID, uuid4
from faker import Faker
from sqlalchemy import select
from app.common.utils import get_one_by
from app.db.session import get_session
from app.item.enums import ItemCategory, ItemCondition
from app.db.models.item import ItemDB
from app.db.models.profile import ProfileDB
import random

fake = Faker()

def au_postcode():
    return str(random.randint(200, 9999)).zfill(4)


def create_mock_profile() -> ProfileDB:
    return ProfileDB(
        email=fake.unique.email(),
        handle=fake.unique.user_name(),
        rating=round(random.uniform(1, 5), 2),
        rating_count=random.randint(0, 1000),
        postcode=au_postcode(),
        avatar_url=fake.image_url(),
        user_id=uuid4(),
    )


def create_mock_item(profile_id: UUID, user_id: UUID) -> ItemDB:
    return ItemDB(
        name=fake.name().capitalize(),
        description=fake.text(max_nb_chars=200),
        price=round(random.uniform(10, 1000), 2),
        brand=fake.company(),
        category=random.choice(list(ItemCategory)),
        condition=random.choice(list(ItemCondition)),
        postcode=au_postcode(),
        image_urls=[fake.image_url() for _ in range(random.randint(0, 3))],
        profile_id=profile_id,
        user_id=user_id,
    )


async def seed_db():
    async for session in get_session():
        res = await session.execute(select(ProfileDB))
        if res.first():
            # print("Database already seeded.")
            return

        mock_profiles = [create_mock_profile() for _ in range(5)]
        session.add_all(mock_profiles)
        await session.commit()

        for profile in mock_profiles:
            items = [create_mock_item(profile.id, profile.user_id) for _ in range(3)]
            session.add_all(items)

        await session.commit()
        print("Seeding complete.")


async def seed_user_items(email, count):
    async for session in get_session():
        profile = await get_one_by(session, ProfileDB, email=email)
        if not profile:
            raise ValueError("Profile not found")
        items = [
            create_mock_item(
                profile_id=profile.id,
                user_id=profile.user_id,
            )
            for _ in range(count)
        ]
        session.add_all(items)
        await session.commit()
        print("User items seeded.")


if __name__ == "__main__":
    asyncio.run(
        seed_user_items(
            "user1@example.com",
            10,
        )
    )
