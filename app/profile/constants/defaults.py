from datetime import datetime

from app.db.models.profile_extra import ProfileExtraDB


def default_profile_extra_db(next_handle_update: datetime):
    return ProfileExtraDB(
        image_limit=3,
        listing_limit=3,
        next_handle_update=next_handle_update,
    )
