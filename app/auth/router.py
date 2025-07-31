from fastapi import APIRouter
from app.auth.firebase.router import firebase_router

auth_router = APIRouter()

auth_router.include_router(firebase_router)
