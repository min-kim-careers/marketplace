from contextlib import asynccontextmanager

from app.auth.firebase.config import initialize_firebase_admin
from app.auth.router import auth_router
from app.core.logger import logger
from app.core.schemas.error import ErrorResponse
from app.db.session import init_db
from app.item.router import items_router
from app.profile.router import profiles_router
from app.chat.router import chat_router
from app.chat.server.websocket import chat_server
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware


async def startup():
    initialize_firebase_admin()
    await init_db()


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


@app.exception_handler(Exception)
async def global_exception_handler(_: Request, exc: Exception):
    logger.error(exc)
    raise ErrorResponse(
        status_code=500,
        message="Internal Server Error",
    )
