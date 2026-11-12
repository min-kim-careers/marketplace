from fastapi import Path

from app.core.helpers import decode_uuid
from app.core.logger import log_exception


@log_exception
def resolve_room_alias(item_alias=Path(alias="itemAlias")):
    return decode_uuid(item_alias)
