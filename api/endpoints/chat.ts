import 'server-only'

import { client } from '@/api/_utils/client'
import { ChatRoom } from '@/chat/chat-room'

export const _getRoomAsBuyer = async (itemAlias: string) =>
  (await client())
    .post(`/api/chat/room/item/${itemAlias}`)
    .withSession()
    .asResult<{
      room: ChatRoom
    }>()
