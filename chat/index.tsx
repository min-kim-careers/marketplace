'use client'

import { ChatSidebar } from '@/chat/chat-sidebar'
import ChatWindow from '@/chat/chat-window'
import { useChatSocketContext } from '@/chat/providers/chat-socket-provider'

export default function Chat() {
  const { isChatting } = useChatSocketContext()

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
