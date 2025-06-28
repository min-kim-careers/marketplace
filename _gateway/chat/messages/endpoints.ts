'use server'

import { createChatAxios } from '@/_gateway/chat/_config/axios'

const authAxios = await createChatAxios('')

export const _REGISTER_USER = async (
  userId: string,
): Promise<{}> =>
  authAxios.post(`/rooms/${userId}/register`)
