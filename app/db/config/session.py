import asyncio
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.common.config import env_loader
from app.db.config.base import Base
from app.db.models.rating import RatingDB

DATABASE_URL = f"postgresql+asyncpg://{env_loader.DB_USER}:{env_loader.DB_PASSWORD}@{env_loader.DB_HOST}/{env_loader.DB_NAME}"

engine = create_async_engine(
    DATABASE_URL,
    echo=False,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    expire_on_commit=False,
    class_=AsyncSession,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as db:
        yield db


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

