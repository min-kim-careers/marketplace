from fastapi import APIRouter, Depends
from app.auth.firebase.router import firebase_router
from app.core.security import verify_service_key

auth_router = APIRouter(
    dependencies=[Depends(verify_service_key)],
)

auth_router.include_router(firebase_router)
