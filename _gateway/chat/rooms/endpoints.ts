'use server'

import { createChatAxios } from '@/_gateway/chat/_config/axios'
import { IChatRoom } from '@/lib/interfaces/chat-session'

const chatAxios = await createChatAxios('')

export interface RegisterRoomRequest {
  itemId: string
  clientId: string
  peerId: string
  withExisting?: boolean
}

export const _REGISTER_ROOM = async (
  request: RegisterRoomRequest,
): Promise<{
  room: IChatRoom
}> =>
  chatAxios
    .post(`/rooms/register`, request)
    .then((res) => res.data)

export const _GET_ROOMS_BY_CLIENT = async (
  clientId: string,
): Promise<{ rooms: IChatRoom[] }> =>
  chatAxios
    .get(`/rooms/client/${clientId}`)
    .then((res) => res.data)
