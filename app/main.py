from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.auth.firebase.config import initialize_firebase_admin
from app.core import logger
from app.tests.mocks import seed_db

from app.db.session import init_db
from app.item.router import items_router
from app.profile.router import profiles_router
from app.auth.router import auth_router
from app.chat.router import chat_router
from app.chat.websocket import chat_ws_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    initialize_firebase_admin()

    await init_db()
    await seed_db()
    yield


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
app.include_router(chat_ws_router)

# app.mount("/images", StaticFiles(directory="/code/images"), name="images")


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.info(request.url)
    logger.info(exc.errors())  # prints full error list including loc arrays
    # return ErrorResponse(
    #     status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
    #     message=exc.errors()
    # )
