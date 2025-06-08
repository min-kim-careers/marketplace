import os
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlmodel import SQLModel

from app.common.config import env_loader

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"postgresql+asyncpg://{env_loader.DB_USER}:{env_loader.DB_PASSWORD}@{env_loader.DB_HOST}/{env_loader.DB_NAME}",
)

engine = create_async_engine(
    DATABASE_URL,
    echo=True,
)

async_session_factory = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_factory() as session:
        yield session
