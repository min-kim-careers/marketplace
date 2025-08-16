import firebase_admin
from firebase_admin import credentials
from app.core import logger
from app.core.config import env_loader


def initialize_firebase_admin():
    if not firebase_admin._apps:
        try:
            cred = credentials.Certificate(
                {
                    "type": env_loader.FIREBASE_TYPE,
                    "project_id": env_loader.FIREBASE_PROJECT_ID,
                    "private_key_id": env_loader.FIREBASE_PRIVATE_KEY_ID,
                    "private_key": env_loader.FIREBASE_PRIVATE_KEY.replace("\\n", "\n"),
                    "client_email": env_loader.FIREBASE_CLIENT_EMAIL,
                    "client_id": env_loader.FIREBASE_CLIENT_ID,
                    "auth_uri": env_loader.FIREBASE_AUTH_URI,
                    "token_uri": env_loader.FIREBASE_TOKEN_URI,
                    "auth_provider_x509_cert_url": env_loader.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
                    "client_x509_cert_url": env_loader.FIREBASE_CLIENT_X509_CERT_URL,
                    "universe_domain": env_loader.FIREBASE_UNIVERSE_DOMAIN,
                }
            )
            firebase_admin.initialize_app(cred)
            logger.info("Firebase Admin SDK initialized successfully!")
        except Exception as e:
            logger.info(f"Error initializing Firebase Admin SDK: {e}")
