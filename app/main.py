from contextlib import asynccontextmanager

from app.auth.firebase.config import initialize_firebase_admin
from app.auth.router import auth_router
from app.core import logger
from app.db.session import init_db
from app.item.router import items_router
from app.message.router import messages_router
from app.profile.router import profiles_router
from app.tests.mocks import seed_db
from app.thread.router import threads_router
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware


@asynccontextmanager
async def lifespan(_: FastAPI):
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
app.include_router(threads_router)
app.include_router(messages_router)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.info(request.url)
    logger.info(exc.errors())  # prints full error list including loc arrays
    # return ErrorResponse(
    #     status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
    #     message=exc.errors()
    # )
