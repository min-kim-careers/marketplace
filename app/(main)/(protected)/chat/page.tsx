'use server'

import * as CHAT_SERVICE from '@/_gateway/chat/rooms/service'
import Chat from '@/components/02_content/chat'
import { notFound } from 'next/navigation'
import { z } from 'zod'

const ChatParamsSchema = z
  .object({
    item: z.string().nonempty(),
    handle: z.string().nonempty(),
  })
  .strict()

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined
  }>
}) {
  const urlParams = await searchParams

  const result = ChatParamsSchema.safeParse(urlParams)

  const existingRooms =
    await CHAT_SERVICE.GET_EXISTING_ROOMS()

  if (!result.success)
    return <Chat existingRooms={existingRooms} />

  const { item: itemId, handle } = result.data

  const currentRoom = await CHAT_SERVICE.REGISTER_ROOM(
    itemId,
    handle,
  )
  if (!currentRoom) notFound()

  return (
    <Chat
      currentRoom={currentRoom}
      existingRooms={existingRooms}
    />
  )
}
