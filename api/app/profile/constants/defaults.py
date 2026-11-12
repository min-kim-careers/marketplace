from app.db.models.profile_extra import ProfileExtraDB


DEFAULT_EXTRA_IMAGE_LIMIT = 3
DEFAULT_EXTRA_LISTING_LIMIT = 3
DEFAULT_HANDLE_UPDATE_INTERVAL_IN_DAYS = 28
DEFAULT_EMAIL_UPDATE_INTERVAL_IN_DAYS = 7

def default_profile_extra():
    return ProfileExtraDB(
        image_limit=DEFAULT_EXTRA_IMAGE_LIMIT, listing_limit=DEFAULT_EXTRA_LISTING_LIMIT
    )