from .item import ItemDB
from .chat_message import ChatMessageDB
from .profile import ProfileDB
from .profile_extra import ProfileExtraDB
from .chat_room import ChatRoomDB
from .user import UserDB

_ = (
    UserDB,
    ProfileDB,
    ProfileExtraDB,
    ItemDB,
    ChatRoomDB,
    ChatMessageDB,
)
