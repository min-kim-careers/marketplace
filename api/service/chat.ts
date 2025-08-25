'use server'

import {
  _getRooms,
  _getRoom,
  _getUnreadMessagesCount,
} from '@/api/endpoints'

export const getRoom = async (peerHandle: string, itemId: string) => {
  try {
    const { room } = await _getRoom(peerHandle, itemId)
    return room
  } catch (error) {
    console.error(error)
  }
}

export const getRooms = async () => {
  try {
    const { rooms } = await _getRooms()
    return rooms
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
