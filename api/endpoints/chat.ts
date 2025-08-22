import 'server-only'

import { client } from '@/api/_utils/client'

export const _getRoomSlug = async (peerHandle: string, itemSlug: string) =>
  (await client())
    .post(`/api/chat/rooms/peer/${peerHandle}/item/${itemSlug}`)
    .withSession()
    .asResult<{
      roomSlug: string
    }>()

  export const _getRooms = async () =>
  (await client())
    .get(`/api/chat/rooms`)
    .withSession()
    .asResult<{
      // roomSlug: string
    }>()

  export const _getUnreadMessagesCount = async () =>
  (await client())
    .get(`/api/chat/messages/unread/count`)
    .withSession()
    .asResult<{
      count: number
    }>()

