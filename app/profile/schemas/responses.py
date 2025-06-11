from typing import Generic, List, Optional, TypeVar

from app.common.schemas.response import ResponseBase
from app.item.schemas.common import ItemOut
from app.profile.schemas.common import ProfileOut


T = TypeVar("T")


class ProfileResponse(ResponseBase, Generic[T]):
    success: bool = False
    data: Optional[T] = None

class GetProfileResponse(ResponseBase):
    profile: ProfileOut

class UpsertProfileResponse(ResponseBase):
    profile: ProfileOut

class CheckHandleExistsResponse(ResponseBase):
    exists: bool

class GetUserItemsResponse(ResponseBase):
    items: List[ItemOut]