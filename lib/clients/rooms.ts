'use server'

import { ChatRoom } from '@/chat/types/chat-room'
import { client } from '@/lib/utils/client'

export const GET_ROOM_ID = async (itemSlug: string, handle: string) =>
  (await client())
    .post(`/get-room-id/item/${itemSlug}/handle/${handle}`)
    .asResult<{ roomId: string }>({ withSession: true })

export const GET_EXISTING_ROOMS = async () =>
  (await client())
    .get(`/get-existing-rooms`)
    .asResult<{ rooms: ChatRoom[] }>({ withSession: true })

export const DELETE_ROOM_BY_SLUG = async (roomSlug: string) =>
  (await client())
    .delete(`/delete-room-by-id/room/${roomSlug}`)
    .asResult<{ deleted: boolean }>({ withSession: true })
