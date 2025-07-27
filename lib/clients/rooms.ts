'use server'

import { ChatRoom } from '@/chat/types/chat-room'
import { makeClient } from '@/lib/utils/client'

export const FETCH_ROOM_ID = async (itemSlug: string, handle: string) =>
  (await makeClient())
    .post(`/fetch-room-id/itemSlug/${itemSlug}/handle/${handle}`)
    .parseResult<{ roomId: string }>({ withSession: true })

export const GET_EXISTING_ROOMS = async () =>
  (await makeClient())
    .get(`/get-existing-rooms`)
    .parseResult<{ rooms: ChatRoom[] }>({ withSession: true })

export const DELETE_ROOM_BY_SLUG = async (roomSlug: string) =>
  (await makeClient())
    .delete(`/delete-room-by-id/roomSlug/${roomSlug}`)
    .parseResult<{ deleted: boolean }>({ withSession: true })
