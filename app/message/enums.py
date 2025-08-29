from enum import Enum


class MessageSortOrder(str, Enum):
    asc = "asc"
    desc = "desc"


class MessageSortBy(str, Enum):
    created_at = "created_at"
    updated_at = "updated_at"
