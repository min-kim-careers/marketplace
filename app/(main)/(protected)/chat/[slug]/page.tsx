'use server'

import * as CHAT_SERVICE from '@/lib/clients/rooms'
import Chat from '@/chat'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { ChatRoom } from '@/chat/interfaces/chat-room'
import { ChatPageProvider } from '@/chat/providers/chat-page-provider'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { toUrlParams } from '@/lib/helpers/to-url-params'

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const headerList = await headers()
  const pathname = headerList.get('x-current-path')

  const { slug } = await params

  const isIndex = pathname === APP_ROUTES.CHAT.indexHref

  if (!slug && !isIndex) notFound()

  const existingRooms = await CHAT_SERVICE.GET_EXISTING_ROOMS()

  var currentRoom: ChatRoom | null = null
  if (slug && !isIndex) {
    currentRoom = existingRooms.find((r) => r.id === slug) || null
    if (!currentRoom) notFound()
  }

  return (
    <ChatPageProvider
      key={toUrlParams({ ...currentRoom, ...existingRooms }).toString()}
      props={{ currentRoom, existingRooms }}
    >
      <Chat />
    </ChatPageProvider>
  )
}
