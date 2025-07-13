'use server'

import { createChatAxios } from '@/_gateway/chat/_config/axios'
import { RegisterRoomRequest } from '@/_gateway/chat/rooms/service'
import { ChatRoom } from '@/chat/interfaces/chat-room'

const chatAxios = await createChatAxios('')

export const _REGISTER_ROOM = async (
  request: RegisterRoomRequest,
): Promise<{
  room: ChatRoom
}> => chatAxios.post(`/rooms/register`, request).then((res) => res.data)

export const _GET_ROOMS_BY_CLIENT = async (
  clientId: string,
): Promise<{ rooms: ChatRoom[] }> =>
  chatAxios.get(`/rooms/client/${clientId}`).then((res) => res.data)

export const _DELETE_ROOM_BY_ID = async (roomSlug: string) =>
  chatAxios.delete(`/rooms/${roomSlug}`).then((res) => res.data)
