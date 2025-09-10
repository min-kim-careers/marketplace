'use client'

import { ChatSocketState, useChatSocket } from '@/chat/hooks/use-chat-socket'
import { createContext, PropsWithChildren, useContext } from 'react'

export type ChatState = ChatSocketState

const ChatContext = createContext<ChatState | null>(null)

export default function ChatProvider({ children }: PropsWithChildren) {
  const socket = useChatSocket()

  return (
    <ChatContext.Provider value={{ ...socket }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChatContext = () => {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('Not inside provider')
  return ctx
}
