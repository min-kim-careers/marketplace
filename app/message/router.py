from typing import Annotated
from uuid import UUID

from app.auth.firebase.dependencies import resolve_firebase_session
from app.core.schemas.error import ErrorResponse
from app.core.schemas.outbound import APIResponse
from app.core.security import verify_service_key
from app.db.models.user import UserDB
from app.db.session import get_db
from app.message.dependencies import resolve_thread_id
from app.message.repository import MessageRepository
from app.message.schemas.inbound import MessageIn, MessageInCreateDB, MessageQuery
from app.message.schemas.outbound import MessageOut
from fastapi import APIRouter, Body, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

messages_router = APIRouter(
    prefix="/api/messages",
    tags=["Message"],
    dependencies=[Depends(verify_service_key)],
)


@messages_router.get("/thread/{thread_id}")
async def get_messages(
    query: Annotated[MessageQuery, Query()],
    thread_id: UUID = Depends(resolve_thread_id),
    user: UserDB = Depends(resolve_firebase_session),
    db: AsyncSession = Depends(get_db),
):
    messages = await MessageRepository.query_paginated(db, thread_id, query)


@messages_router.post("/thread/{thread_id}")
async def add_message(
    _: UserDB = Depends(resolve_firebase_session),
    thread_id: UUID = Depends(resolve_thread_id),
    message_in: MessageIn = Body(...),
    db: AsyncSession = Depends(get_db),
):
    message_db = await MessageRepository.create(
        db,
        thread_id,
        MessageInCreateDB(
            content=message_in.content,
        ),
    )
    if not message_db:
        raise ErrorResponse(message="error creating message")

    message = MessageOut.from_db(message_db)

    return APIResponse(data={"message": message})
