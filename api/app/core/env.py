from pydantic_settings import BaseSettings, SettingsConfigDict


class Env(BaseSettings):
    DB_HOST: str
    DB_PORT: str
    DB_USER: str
    DB_PASSWORD: str
    DB_NAME: str

    CACHE_HOST: str
    CACHE_PORT: str
    CACHE_PASSWORD: str
    CACHE_DB: str

    FIREBASE_CREDENTIALS_PATH: str = "/run/secrets/firebase-service-account.json"

    SERVICE_KEY: str
    SERVICE_KEY_HEADER: str

    SESSION_HEADER: str

    FRONTEND_IMAGE_BASE: str
    CONTAINER_IMAGE_DIR: str

    TURNSTILE_URL: str
    CF_TURNSTILE_SECRET: str
    NONCE_SECRET: str
    NONCE_LIFETIME_MINUTES: int

    model_config = SettingsConfigDict(
        env_file=".env",
    )
