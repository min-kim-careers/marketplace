import humanize
from datetime import datetime, timedelta


def format_item_date(dt: datetime) -> str:
    now = datetime.now(dt.tzinfo)
    diff = now - dt

    if timedelta(0) < diff < timedelta(days=1):
        return dt.strftime("%I:%M %p")
    return humanize.naturaltime(diff)
