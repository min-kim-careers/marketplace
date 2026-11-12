from app.core import env
from app.core.logger import log_exception
from app.core.schemas.error import ErrorResponse


import jwt


@log_exception
def verify_nonce(nonce: str):
    try:
        jwt.decode(
            nonce,
            env.NONCE_SECRET,
            algorithms=["HS256"],
            options={"require_exp": True},
        )
        return True
    except jwt.ExpiredSignatureError:
        raise ErrorResponse(status_code=403, message="Nonce expired")
    except jwt.InvalidTokenError:
        raise ErrorResponse(status_code=403, message="Invalid nonce")
