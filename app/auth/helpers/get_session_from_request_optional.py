from app import core


from fastapi import Cookie


def get_session_from_request_optional(
    session: str | None = Cookie(default=None, alias=core.env.SESSION_HEADER)
) -> str | None:
    return session