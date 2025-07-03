'use server'

import { getCurrentUserId } from '@/_gateway/api/_config/helpers'
import { logChatError } from '@/_gateway/chat/_config/helpers'
import * as CHAT_ENDPOINTS from '@/_gateway/chat/rooms/endpoints'
import * as PROFILE_ENDPOINTS from '@/_gateway/api/profile/endpoints'
import { IChatRoom } from '@/lib/interfaces/chat-session'

export const REGISTER_ROOM = async (
  itemId: string,
  handle: string,
): Promise<IChatRoom | null> => {
  try {
    const { userId: peerId } =
      await PROFILE_ENDPOINTS._GET_USER_ID_BY_HANDLE(handle)

    const userId = await getCurrentUserId()
    if (!userId) throw new Error()

    const { room } = await CHAT_ENDPOINTS._REGISTER_ROOM({
      clientId: userId,
      peerId,
      itemId,
    })

    return room
  } catch (error) {
    logChatError(error)
    return null
  }
}

export const GET_EXISTING_ROOMS = async (): Promise<
  IChatRoom[]
> => {
  try {
    const userId = await getCurrentUserId()
    if (!userId) throw new Error()

    const { rooms } =
      await CHAT_ENDPOINTS._GET_ROOMS_BY_CLIENT(userId)

    return rooms
  } catch (error) {
    logChatError(error)
    return []
  }
}
