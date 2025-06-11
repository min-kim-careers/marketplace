from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.common.database import init_db
from app.common.mocks import seed_db
from app.common.security import verify_service_key

from app.item.public.router import items_public_router
from app.item.protected.router import items_protected_router
from app.profile.router import profiles_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    await seed_db()
    yield


app = FastAPI(
    lifespan=lifespan,
    debug=False,
    dependencies=[Depends(verify_service_key)],
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(items_public_router, prefix="/api/items", tags=['Items - Public'])
app.include_router(items_protected_router, prefix="/api/items", tags=['Items - Protected'])
app.include_router(profiles_router, prefix="/api/profiles", tags=['Profiles'])
