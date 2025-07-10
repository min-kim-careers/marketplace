'use server'

import { getCurrentUserId } from '@/_gateway/api/_config/helpers'
import * as ITEM_ENDPOINTS from '@/_gateway/api/item/endpoints'
import * as PROFILE_ENDPOINTS from '@/_gateway/api/profile/endpoints'
import { logChatError } from '@/_gateway/chat/_config/helpers'
import * as CHAT_ENDPOINTS from '@/_gateway/chat/rooms/endpoints'
import { IChatRoomWithItem } from '@/lib/interfaces/chat-room'

export interface RegisterRoomRequest {
  itemId: string
  clientId: string
  peerId: string
}

export const FETCH_ROOM_ID = async (
  itemId: string,
  handle: string,
): Promise<string | null> => {
  try {
    const userId = await getCurrentUserId()
    if (!userId) throw new Error()

    const { userId: peerId } =
      await PROFILE_ENDPOINTS._GET_USER_ID_BY_HANDLE(handle)

    const { room } = await CHAT_ENDPOINTS._REGISTER_ROOM({
      clientId: userId,
      itemId,
      peerId,
    })

    return room.id
  } catch (error) {
    logChatError(error)
    return null
  }
}

export const GET_EXISTING_ROOMS = async (): Promise<IChatRoomWithItem[]> => {
  try {
    const userId = await getCurrentUserId()
    if (!userId) throw new Error()

    const { rooms } = await CHAT_ENDPOINTS._GET_ROOMS_BY_CLIENT(userId)
    if (!rooms.length) return []

    const itemIds = rooms.map((r) => r.itemId)

    const { items, order } = await ITEM_ENDPOINTS._GET_ITEMS_BY_IDS(itemIds)

    return rooms.map((r, i) => ({ ...r, item: items[order[i]] }))
  } catch (error) {
    logChatError(error)
    return []
  }
}
