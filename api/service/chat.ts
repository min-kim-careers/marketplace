'use server'

import { _getRoomSlug } from '@/api/endpoints'

export const getRoomSlug = async (peerHandle: string) => {
  try {
    const { roomSlug } = await _getRoomSlug(peerHandle)
    return roomSlug
  } catch (error) {
    console.error(error)
  }
}
