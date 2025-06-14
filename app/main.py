from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.common.database import init_db
from app.common.mocks import seed_db
from app.common.security import verify_service_key

from app.item.router import items_router
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


app.include_router(items_router, prefix="/api/items", tags=['Items'])
app.include_router(profiles_router, prefix="/api/profiles", tags=['Profiles'])

app.mount('/images', StaticFiles(directory='/code/images'), name='images')