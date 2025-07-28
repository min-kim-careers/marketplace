'use server'

import { ChatRoom } from '@/chat/types/chat-room'
import { gateway } from '@/lib/utils/client'

export const FETCH_ROOM_ID = async (itemSlug: string, handle: string) =>
  (await gateway())
    .post(`/fetch-room-id/itemSlug/${itemSlug}/handle/${handle}`)
    .asResult<{ roomId: string }>({ withSession: true })

export const GET_EXISTING_ROOMS = async () =>
  (await gateway())
    .get(`/get-existing-rooms`)
    .asResult<{ rooms: ChatRoom[] }>({ withSession: true })

export const DELETE_ROOM_BY_SLUG = async (roomSlug: string) =>
  (await gateway())
    .delete(`/delete-room-by-id/roomSlug/${roomSlug}`)
    .asResult<{ deleted: boolean }>({ withSession: true })
