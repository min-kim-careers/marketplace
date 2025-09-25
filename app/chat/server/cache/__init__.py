from app.chat.server.cache.unread_rooms import UnreadRooms
from app.chat.server.cache.user_active import UserActive
from app.chat.server.cache.user_active_room import UserActiveRoom


class ChatCache(UserActiveRoom, UserActive, UnreadRooms):
    pass


chat_cache = ChatCache()
