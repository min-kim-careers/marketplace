import firebase_admin
from app.core import env, logger
from firebase_admin import credentials


def initialize_firebase_admin():
    if not firebase_admin._apps:
        try:
            cred = credentials.Certificate(
                {
                    "type": env.FIREBASE_TYPE,
                    "project_id": env.FIREBASE_PROJECT_ID,
                    "private_key_id": env.FIREBASE_PRIVATE_KEY_ID,
                    "private_key": env.FIREBASE_PRIVATE_KEY.replace("\\n", "\n"),
                    "client_email": env.FIREBASE_CLIENT_EMAIL,
                    "client_id": env.FIREBASE_CLIENT_ID,
                    "auth_uri": env.FIREBASE_AUTH_URI,
                    "token_uri": env.FIREBASE_TOKEN_URI,
                    "auth_provider_x509_cert_url": env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
                    "client_x509_cert_url": env.FIREBASE_CLIENT_X509_CERT_URL,
                    "universe_domain": env.FIREBASE_UNIVERSE_DOMAIN,
                }
            )
            firebase_admin.initialize_app(cred)
            logger.info("Firebase Admin SDK initialized")
        except Exception as e:
            logger.info(f"Error initializing Firebase Admin SDK: {e}")
