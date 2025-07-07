'use server'

import * as CHAT_SERVICE from '@/_gateway/chat/rooms/service'
import Chat from '@/components/02_content/chat'
import { IChatRoom } from '@/lib/interfaces/chat-room'
import { ChatPageProvider } from '@/lib/providers/chat-page-provider'
import { z } from 'zod'

const ChatParamsSchema = z
  .object({
    roomId: z.string().nonempty(),
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

  const existingRooms = await CHAT_SERVICE.GET_EXISTING_ROOMS()

  var currentRoom: IChatRoom | null =
    (result.success &&
      existingRooms.find((r) => r.id === result.data.roomId)) ||
    null

  return (
    <ChatPageProvider props={{ currentRoom, existingRooms }}>
      <Chat />
    </ChatPageProvider>
  )
}
