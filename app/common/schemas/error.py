from typing import Dict, Optional

from fastapi import HTTPException

from app.common.schemas.response import ResponseBase


class ErrorDetail(ResponseBase):
    message: Optional[str]
    # user_message: Optional[str]


class ErrorResponse(HTTPException):
    def __init__(
        self,
        status_code: int = 500,
        message: Optional[str] = None,
        # user_message: Optional[str] = None,
        headers: Dict[str, str] | None = None,
    ) -> None:

        detail = ErrorDetail(
            message=message,
            # user_message=user_message,
        )

        super().__init__(
            status_code=status_code,
            detail=detail.model_dump(by_alias=True),
            headers=headers,
        )
