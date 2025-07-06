'use client'

import { ChatSidebar } from '@/components/00_common/chat/chat-sidebar'
import ChatWindow from '@/components/00_common/chat/chat-window'
import { useChatSocket } from '@/components/00_common/chat/hooks/use-chat-socket'
import { useIsMobile } from '@/lib/hooks/use-is-mobile'

export default function Chat() {
  const isMobile = useIsMobile()

  const {
    messages,
    noMessages,
    loading,
    isChatting,

    sendChat,
    leaveChat,
  } = useChatSocket()

  return (
    <div className='flex max-h-[92vh] h-[92vh] w-full flex-1 flex-row rounded-lg border'>
      <ChatSidebar className='flex flex-col items-center justify-start py-2' />

      <ChatWindow
        className='flex w-full overflow-hidden flex-col gap-2 border-l p-2 '
        messages={messages}
        leaveChat={leaveChat}
        sendChat={sendChat}
      />
    </div>
  )
}
