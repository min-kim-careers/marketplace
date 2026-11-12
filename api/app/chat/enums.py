from enum import Enum


class RoomSortOrder(str, Enum):
    asc = "asc"
    desc = "desc"


class RoomSortBy(str, Enum):
    created_at = "created_at"
    updated_at = "updated_at"
