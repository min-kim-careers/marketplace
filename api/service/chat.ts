'use server'

import { _getRoomSlug, _getUnreadMessagesCount } from '@/api/endpoints'

export const getRoomId = async (peerHandle: string, itemId: string) => {
  try {
    const { roomSlug } = await _getRoomSlug(peerHandle, itemId)
    return roomSlug
  } catch (error) {
    console.error(error)
  }
}

export const getUnreadMessagesCount = async () => {
  try {
    const { count } = await _getUnreadMessagesCount()
    return count
  } catch (error) {
    console.error(error)
    return 0
  }
}
