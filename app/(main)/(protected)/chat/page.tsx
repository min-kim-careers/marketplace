'use server'

import { GET_USER_ID_BY_HANDLE } from '@/_gateway/api/profile/service'
import { REGISTER_ROOM } from '@/_gateway/chat/rooms/service'
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

  if (!result.success) return <Chat />

  const { item: itemId, handle } = result.data

  const peerId = await GET_USER_ID_BY_HANDLE(handle)

  if (!peerId) notFound()

  const roomId = await REGISTER_ROOM(itemId, peerId)

  return (
    <Chat
      session={{
        roomId,
      }}
    />
  )
}
