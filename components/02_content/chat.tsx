'use client'

import { ChatSidebar } from '@/components/00_common/chat/chat-sidebar'
import ChatWindow from '@/components/00_common/chat/chat-window'
import { useChatPageStore } from '@/lib/providers/chat-page-provider'
import { useChatSocketContext } from '@/lib/providers/chat-socket-provider'
import { useEffect } from 'react'

export default function Chat() {
  const { isChatting, setCurrentRoom } = useChatSocketContext()
  const { currentRoom } = useChatPageStore()

  useEffect(() => setCurrentRoom(currentRoom), [currentRoom])

  return (
    <div className='relative flex max-h-[93vh] w-full flex-1 flex-row rounded-lg border'>
      <ChatSidebar className='flex min-h-full flex-col items-center justify-start border-r py-2' />

      {isChatting() ? (
        <ChatWindow className='flex min-h-full flex-col gap-2 overflow-hidden p-2' />
      ) : (
        <div className='flex flex-1 items-center justify-center text-lg italic text-gray-400'>
          No session
        </div>
      )}
    </div>
  )
}
