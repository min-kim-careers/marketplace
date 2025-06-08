from uuid import uuid4
from datetime import datetime, timezone, timedelta
from faker import Faker
from sqlmodel import select
from app.common.database import get_session
from app.models.item import Item
from app.models.profile import Profile
import random

fake = Faker()


def create_mock_profile() -> Profile:
    return Profile(
        id=uuid4(),
        email=fake.unique.email(),
        handle=fake.unique.user_name(),
        rating=round(random.uniform(1, 5), 2),
        rating_count=random.randint(0, 1000),
        postcode=fake.postcode(),
        avatar_url=fake.image_url(),
        user_id=uuid4(),
    )


def create_mock_item(profile_id) -> Item:
    return Item(
        id=random.randint(1, 10000),
        name=fake.word().capitalize(),
        description=fake.text(max_nb_chars=200),
        price=round(random.uniform(10, 1000), 2),
        category=fake.word(),
        condition=random.choice(["new", "used", "refurbished"]),
        postcode=fake.postcode(),
        image_urls=[fake.image_url() for _ in range(random.randint(1, 5))],
        profile_id=profile_id,
    )


async def seed_db():
    async for session in get_session():
        res = await session.execute(select(Profile))
        if res.first():
            print("Database already seeded.")
            return

        mock_profiles = [create_mock_profile() for _ in range(3)]
        session.add_all(mock_profiles)
        await session.commit()

        for profile in mock_profiles:
            items = [create_mock_item(profile.id) for _ in range(2)]
            session.add_all(items)

        await session.commit()
        print("Seeding complete.")
