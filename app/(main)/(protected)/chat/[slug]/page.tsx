'use server'

import * as CHAT_SERVICE from '@/_gateway/chat/rooms/service'
import Chat from '@/chat'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { ChatRoom } from '@/chat/interfaces/chat-room'
import { ChatPageProvider } from '@/chat/providers/chat-page-provider'
import { notFound } from 'next/navigation'

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const isIndex = slug === APP_ROUTES.CHAT.index

  const existingRooms = await CHAT_SERVICE.GET_EXISTING_ROOMS()

  var currentRoom: ChatRoom | null = null
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
