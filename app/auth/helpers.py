from app.core import config
from app.core.schemas.error import ErrorResponse


from fastapi import Cookie, status


def get_session_from_request(
    session: str | None = Cookie(default=None, alias=config.env_loader.SESSION_HEADER)
) -> str:
    if not session:
        raise ErrorResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            message="Not authenticated: No session cookie found in Cookie header.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return session


def get_session_from_request_optional(
    session: str | None = Cookie(default=None, alias=config.env_loader.SESSION_HEADER)
) -> str | None:
    return session
