'use server'

import { _getRoomByItem, _getRooms, _GetRoomsQuery } from '@/api/endpoints'

export const getRoom = async (itemAlias: string) => {
  try {
    const { room } = await _getRoomByItem(itemAlias)
    return room
  } catch (error) {
    console.error(error)
  }
}

export type GetRoomsQuery = _GetRoomsQuery
export const getRooms = async (query: GetRoomsQuery) => {
  try {
    const { rooms } = await _getRooms({ ...query })
    return rooms
  } catch (error) {
    console.error(error)
    return []
  }
}
