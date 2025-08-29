'use server'

import { _getRoomAsBuyer } from '@/api/endpoints'

export const getRoom = async (itemAlias: string) => {
  try {
    const { room } = await _getRoomAsBuyer(itemAlias)
    return room
  } catch (error) {
    console.error(error)
  }
}
