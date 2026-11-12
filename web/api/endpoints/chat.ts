import 'server-only'

import { client } from '@/api/_utils/client'
import { ChatRoom } from '@/chat/types/chat-room'

export const _getRoomByItem = async (itemAlias: string) =>
  (await client())
    .post(`/api/chat/room/item/${itemAlias}`)
    .withSession()
    .asResult<{
      room: ChatRoom
    }>()

export interface _GetRoomsQuery {
  page: number
  sortBy?: string
  sortOrder?: string
  limit?: number
}
export const _getRooms = async (query: _GetRoomsQuery) =>
  (await client())
    .get(`/api/chat/room/list`)
    .withSession()
    .setQuery(query)
    .asResult<{
      rooms: ChatRoom[]
    }>()

export const _unreadExists = async () =>
  (await client())
    .get(`/api/chat/message/unread/exists`)
    .withSession()
    .asResult<{
      exists: boolean
    }>()
