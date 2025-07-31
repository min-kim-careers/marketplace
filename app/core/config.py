from pydantic_settings import BaseSettings, SettingsConfigDict


class EnvLoader(BaseSettings):
    DB_HOST: str
    DB_PORT: str
    DB_USER: str
    DB_PASSWORD: str
    DB_NAME: str

    SERVICE_KEY: str
    SERVICE_KEY_HEADER: str

    model_config = SettingsConfigDict(
        env_file=".env",
    )


env_loader = EnvLoader()  # type: ignore
