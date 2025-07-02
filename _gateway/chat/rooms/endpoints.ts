'use server'

import { createChatAxios } from '@/_gateway/chat/_config/axios'

const authAxios = await createChatAxios('')

export interface RegisterRoomRequest {
  itemId: string
  client1: string
  client2: string
}

export const _REGISTER_ROOM = async (
  request: RegisterRoomRequest,
): Promise<{ roomId: string }> =>
  authAxios
    .post(`/rooms/register`, request)
    .then((res) => res.data)
