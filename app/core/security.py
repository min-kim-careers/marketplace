from app.core import env
from app.core.schemas.error import ErrorResponse
from fastapi import Security
from fastapi.security import APIKeyHeader

service_key_header = APIKeyHeader(name=env.SERVICE_KEY_HEADER, auto_error=False)


def verify_service_key(service_key: str = Security(service_key_header)):
    if not service_key:
        raise ErrorResponse(
            status_code=403,
            message="Service key missing",
        )

    if service_key != env.SERVICE_KEY:
        raise ErrorResponse(
            status_code=403,
            message="Service key invalid",
        )
