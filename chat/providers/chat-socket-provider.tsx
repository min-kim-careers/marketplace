'use client'

import { useChatSocket } from '@/chat/hooks/use-chat-socket'
import { ChatSocket } from '../interfaces/chat-socket'
import {
  createContext,
  ReactNode,
  useContext
} from 'react'

interface ChatSocketState extends ChatSocket {
}

const ChatSocketContext = createContext<ChatSocketState | null>(null)

export const ChatSocketProvider = ({ children }: { children: ReactNode }) => {
  const chatSocket: ChatSocket = useChatSocket()

  return (
    <ChatSocketContext.Provider value={{ ...chatSocket }}>
      {children}
    </ChatSocketContext.Provider>
  )
}

export const useChatSocketContext = () => {
  const context = useContext(ChatSocketContext)
  if (!context) throw new Error('Not inside provider')
  return context
}
