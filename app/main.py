from contextlib import asynccontextmanager

from app.auth.firebase.config import initialize_firebase_admin
from app.auth.router import auth_router
from app.core import logger
from app.db.session import init_db
from app.item.router import items_router
from app.profile.router import profiles_router
from app.chat.router import chat_router
from app.chat.server.websocket import chat_server
from app.tests.mocks import seed_db
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware


async def startup():
    initialize_firebase_admin()
    await init_db()
    await seed_db()


async def shutdown():
    pass


@asynccontextmanager
async def lifespan(_: FastAPI):
    await startup()
    yield
    await shutdown()


app = FastAPI(
    lifespan=lifespan,
    debug=False,
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


app.include_router(items_router)
app.include_router(profiles_router)
app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(chat_server)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.info(request.url)
    logger.info(exc.errors())
