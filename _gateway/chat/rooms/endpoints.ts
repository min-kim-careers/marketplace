'use server'

import { createChatAxios } from '@/_gateway/chat/_config/axios'
import { RegisterRoomRequest } from '@/_gateway/chat/rooms/service'
import { IChatRoom } from '@/lib/interfaces/chat-room'

const chatAxios = await createChatAxios('')

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
