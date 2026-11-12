import firebase_admin
from app.core import env
from firebase_admin import credentials

from app.core.logger import log_exception, logger


@log_exception
def initialize_firebase_admin():
    if not firebase_admin._apps:
        cred = credentials.Certificate(env.FIREBASE_CREDENTIALS_PATH)
        firebase_admin.initialize_app(cred)
        logger.info("Firebase Admin SDK initialized")
