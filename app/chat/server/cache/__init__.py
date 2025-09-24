from app.chat.server.cache.last_read import LastRead
from app.chat.server.cache.unread_room_exists import UnreadRoomExists
from app.chat.server.cache.unread_rooms import UnreadRooms
from app.chat.server.cache.user_active import UserActive
from app.chat.server.cache.user_active_room import UserActiveRoom


class ChatCache(
    LastRead,
    UnreadRoomExists,
    UnreadRooms,
    UserActiveRoom,
    UserActive,
):
    pass


chat_cache = ChatCache()
