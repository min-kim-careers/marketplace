import 'server-only'

import { client } from '@/api/_utils/client'
import { ChatRoom } from '@/lib/types/chat-room'

// rooms

export const _getRoom = async (peerHandle: string, itemAlias: string) =>
  (await client())
    .post(`/api/chat/rooms/peer/${peerHandle}/item/${itemAlias}`)
    .withSession()
    .asResult<{
      room: ChatRoom
    }>()

export const _getRooms = async () =>
  (await client()).get(`/api/chat/rooms`).withSession().asResult<{
    rooms: ChatRoom[]
  }>()

// messages

export const _getUnreadMessagesCount = async () =>
  (await client())
    .get(`/api/chat/messages/unread/count`)
    .withSession()
    .asResult<{
      count: number
    }>()
