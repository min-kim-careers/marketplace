'use server'

import Chat from '@/chat'
import { ChatRoom } from '@/chat/types/chat-room'
import { ChatPageProvider } from '@/chat/providers/chat-page-provider'
import * as CHAT_SERVICE from '@/lib/clients/rooms'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { toURLSearchParams } from '@/lib/helpers/to-url-search-params'
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

  if (!slug && !isIndex) notFound()

  const existingRooms = await CHAT_SERVICE.GET_EXISTING_ROOMS()

  var currentRoom: ChatRoom | null = null
  if (slug && !isIndex) {
    currentRoom = existingRooms.find((r) => r.id === slug) || null
    if (!currentRoom) notFound()
  }

  return (
    <ChatPageProvider
      key={toURLSearchParams({ ...currentRoom, ...existingRooms }).toString()}
      props={{ currentRoom, existingRooms }}
    >
      <Chat />
    </ChatPageProvider>
  )
}
