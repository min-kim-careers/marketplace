'use server'

import { ChatRoom } from '@/chat/interfaces/chat-room'

export const FETCH_ROOM_ID = async (
  itemId: string,
  handle: string,
): Promise<string | null> => {
  return null
  // try {
  //   const userId = await getCurrentUserId()
  //   if (!userId) throw new Error()

  //   const { userId: peerId } =
  //     await PROFILE_ENDPOINTS._GET_USER_ID_BY_HANDLE(handle)

  //   const { room } = await CHAT_ENDPOINTS._REGISTER_ROOM({
  //     clientId: userId,
  //     itemId,
  //     peerId,
  //   })

  //   return room.id
  // } catch (error) {
  //   return null
  // }
}

export const GET_EXISTING_ROOMS = async (): Promise<ChatRoom[]> => {
  return []
  // try {
  //   const userId = await getCurrentUserId()
  //   if (!userId) throw new Error()

  //   const { rooms } = await CHAT_ENDPOINTS._GET_ROOMS_BY_CLIENT(userId)
  //   if (!rooms.length) return []

  //   const itemIds = rooms.map((r) => r.itemId)

  //   const { items, order } = await ITEM_ENDPOINTS._GET_ITEMS_BY_IDS(itemIds)

  //   const res = rooms.map((r, i) => ({ ...r, item: items[order[i]] }))

  //   return res
  // } catch (error) {
  //   return []
  // }
}

export const DELETE_ROOM_BY_ID = async (roomId: string): Promise<boolean> => {
  return false
  // try {
  //   await CHAT_ENDPOINTS._DELETE_ROOM_BY_ID(roomId)
  //   return true
  // } catch (error) {
  //   return false
  // }
}
