import { ChatRoom } from '@/chat/types/chat-room'

export const upsertChatRoom = (rooms: ChatRoom[], newRoom: ChatRoom) => {
  const filtered = rooms.filter((r) => r.alias !== newRoom.alias)
  return [newRoom, ...filtered]
}
