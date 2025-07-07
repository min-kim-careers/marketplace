'use client'

import { ChatSidebar } from '@/components/00_common/chat/chat-sidebar'
import ChatWindow from '@/components/00_common/chat/chat-window'
import { useChatSocket } from '@/components/00_common/chat/hooks/use-chat-socket'

export default function Chat() {
  const {
    messages,
    noMessages,
    loading,
    hasSession,

    sendChat,
    leaveChat,
  } = useChatSocket()

  return (
    <div className='relative flex max-h-[93vh] w-full flex-1 flex-row rounded-lg border'>
      <ChatSidebar className='flex min-h-full flex-col items-center justify-start border-r py-2' />

      {hasSession ? (
        <ChatWindow
          className='flex min-h-full w-full flex-col gap-2 overflow-hidden p-2'
          messages={messages}
          leaveChat={leaveChat}
          sendChat={sendChat}
          loading={loading}
        />
      ) : (
        <div className='flex flex-1 items-center justify-center text-lg italic text-gray-400'>
          No session
        </div>
      )}
    </div>
  )
}
