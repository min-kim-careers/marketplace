from uuid import UUID, uuid4
from faker import Faker
from sqlalchemy import select
from app.common.database import get_session
from app.item.enums import ItemCategory, ItemCondition
from app.item.model import ItemDB
from app.profile.model import ProfileDB
import random

fake = Faker('en_AU')


def create_mock_profile() -> ProfileDB:
    return ProfileDB(
        id=uuid4(),
        email=fake.unique.email(),
        handle=fake.unique.user_name(),
        rating=round(random.uniform(1, 5), 2),
        rating_count=random.randint(0, 1000),
        postcode=fake.postcode(),
        avatar_url=fake.image_url(),
        user_id=uuid4(),
    )


def create_mock_item(profile_id: UUID) -> ItemDB:
    return ItemDB(
        name=fake.name().capitalize(),
        description=fake.text(max_nb_chars=200),
        price=round(random.uniform(10, 1000), 2),
        category=random.choice(list(ItemCategory)),
        condition=random.choice(list(ItemCondition)),
        postcode=fake.postcode(),
        image_urls=[fake.image_url() for _ in range(random.randint(0, 3))],
        profile_id=profile_id,
    )


async def seed_db():
    async for session in get_session():
        res = await session.execute(select(ProfileDB))
        if res.first():
            print("Database already seeded.")
            return

        mock_profiles = [create_mock_profile() for _ in range(5)]
        session.add_all(mock_profiles)
        await session.commit()

        for profile in mock_profiles:
            items = [create_mock_item(profile.id) for _ in range(3)]
            session.add_all(items)

        await session.commit()
        print("Seeding complete.")
