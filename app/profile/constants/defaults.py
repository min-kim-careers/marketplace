from datetime import datetime

from app.db.models.profile_extra import ProfileExtraDB


def default_profile_extra_db(handle_update_from: datetime):
    return ProfileExtraDB(
        image_limit=3,
        listing_limit=3,
        handle_update_from=handle_update_from,
    )
