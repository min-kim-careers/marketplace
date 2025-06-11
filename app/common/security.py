from fastapi import Security
from fastapi.security import APIKeyHeader

from app.common.schemas.error import ErrorResponse
from app.common.config import env_loader

service_key_header = APIKeyHeader(name=env_loader.SERVICE_KEY_HEADER, auto_error=False)


def verify_service_key(service_key: str = Security(service_key_header)):
    if not service_key:
        raise ErrorResponse(
            status_code=403,
            message="Service key missing",
        )

    if service_key != env_loader.SERVICE_KEY:
        raise ErrorResponse(
            status_code=403,
            message="Service key invalid",
        )