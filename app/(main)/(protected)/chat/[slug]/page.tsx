'use server'

import * as CHAT_SERVICE from '@/_gateway/chat/rooms/service'
import Chat from '@/components/02_content/chat'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { IChatRoomWithItem } from '@/lib/interfaces/chat-room'
import { ChatPageProvider } from '@/lib/providers/chat-page-provider'
import { ChatSocketProvider } from '@/lib/providers/chat-socket-provider'
import { notFound } from 'next/navigation'

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const isIndex = slug === APP_ROUTES.CHAT.index

  const existingRooms = await CHAT_SERVICE.GET_EXISTING_ROOMS()

  var currentRoom: IChatRoomWithItem | null = null
  if (slug && !isIndex) {
    currentRoom = existingRooms.find((r) => r.id === slug) || null
    if (!currentRoom) notFound()
  }

  return (
    <ChatPageProvider props={{ currentRoom, existingRooms }}>
      <Chat />
    </ChatPageProvider>
  )
}
