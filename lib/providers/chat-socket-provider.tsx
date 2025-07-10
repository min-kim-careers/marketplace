'use client'

import { IChatSocket, useChatSocket } from '@/lib/hooks/use-chat-socket'
import { IChatRoomWithItem } from '@/lib/interfaces/chat-room'
import { createContext, ReactNode, useContext, useState } from 'react'

interface ChatSocketState extends IChatSocket {
  setCurrentRoom: (currentRoom: IChatRoomWithItem | null) => void
}

const ChatSocketContext = createContext<ChatSocketState | null>(null)

export const ChatSocketProvider = ({ children }: { children: ReactNode }) => {
  const [currentRoom, setCurrentRoom] = useState<IChatRoomWithItem | null>(null)

  const chatSocket = useChatSocket(currentRoom)

  return (
    <ChatSocketContext.Provider value={{ ...chatSocket, setCurrentRoom }}>
      {children}
    </ChatSocketContext.Provider>
  )
}

export const useChatSocketContext = () => {
  const context = useContext(ChatSocketContext)
  if (!context) throw new Error('Not inside provider')
  return context
}
