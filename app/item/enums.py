from enum import Enum


class ItemCategory(str, Enum):
    cpu = "cpu"
    gpu = "gpu"
    ram = "ram"
    motherboard = "motherboard"
    psu = "psu"
    storage = "storage"
    case = "case"
    cooling = "cooling"
    monitor = "monitor"
    peripheral = "peripheral"
    software = "software"
    other = "other"


class ItemCondition(str, Enum):
    new = "new"
    used = "used"
    refurbished = "refurbished"
    defective = "defective"


class ItemSortOrder(str, Enum):
    asc = "asc"
    desc = "desc"


class ItemSortBy(str, Enum):
    created_at = "created_at"
    updated_at = "updated_at"
    price = "price"
    name_ = "name"


class ItemStatus(str, Enum):
    available = "available"
    pending = "pending"
    sold = "sold"
    inactive = "inactive"
    deleted = "deleted"

    # API ONLY
    expired = "expired"


class ItemUserOption(str, Enum):
    exclude_user = "exclude_user"
    user_only = "user_only"
