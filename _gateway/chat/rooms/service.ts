'use server'

import { getCurrentUserId } from '@/_gateway/api/_config/helpers'
import { getSessionCookie } from '@/_gateway/auth/_config/helpers'
import { logChatError } from '@/_gateway/chat/_config/helpers'
import * as ENDPOINTS from '@/_gateway/chat/rooms/endpoints'

export const REGISTER_ROOM = async (
  itemId: string,
  peerId: string,
): Promise<string> => {
  try {
    const userId = await getCurrentUserId()
    if (!userId) throw new Error()

    const { roomId } = await ENDPOINTS._REGISTER_ROOM({
      clientIds: [userId, peerId],
      itemId,
    })

    return roomId
  } catch (error) {
    logChatError(error)
    throw new Error()
  }
}
