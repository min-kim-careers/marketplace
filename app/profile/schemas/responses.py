from typing import Generic, Optional, TypeVar

from app.common.schemas.response import ApiResponse
from app.profile.schemas.common import ProfileOut


T = TypeVar("T")


class ProfileResponse(ApiResponse, Generic[T]):
    success: bool = False
    data: Optional[T] = None

class GetProfileResponse(ApiResponse):
    profile: ProfileOut

class UpsertProfileResponse(ApiResponse):
    profile: ProfileOut