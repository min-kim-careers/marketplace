'use server'

import Chat from '@/chat'
import { ChatPageProvider } from '@/chat/providers/chat-page-provider'
import { ChatRoom } from '@/chat/types/chat-room'
import { GET_EXISTING_ROOMS } from '@/lib/clients/rooms'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const headerList = await headers()
  const pathname = headerList.get('x-current-path')

  const { slug } = await params

  const isIndex = pathname === APP_ROUTES.CHAT.indexHref

  const { rooms: existingRooms } = await GET_EXISTING_ROOMS()

  var currentRoom: ChatRoom | null = null
  if (slug && !isIndex) {
    currentRoom = existingRooms.find((r) => r.id === slug) || null
    if (!currentRoom) notFound()
  }

  return (
    <ChatPageProvider key={Date.now()} props={{ currentRoom, existingRooms }}>
      <Chat />
    </ChatPageProvider>
  )
}
