'use server'

import { createChatAxios } from '@/_gateway/chat/_config/axios'

const authAxios = await createChatAxios('')

export interface RegisterRoomRequest {
  itemId: string
  clientIds: string[]
}

export const _REGISTER_ROOM = async (
  request: RegisterRoomRequest,
): Promise<{ roomId: string }> =>
  authAxios
    .post(`/rooms/register`, request)
    .then((res) => res.data)
