from datetime import datetime, timedelta

from app.db.models.profile_extra import ProfileExtraDB


DEFAULT_PROFILE_EXTRA = ProfileExtraDB(
    image_limit=3,
    listing_limit=3,
)

DEFAULT_HANDLE_UPDATE_INTERVAL_IN_DAYS = 28
DEFAULT_EMAIL_UPDATE_INTERVAL_IN_DAYS = 7
