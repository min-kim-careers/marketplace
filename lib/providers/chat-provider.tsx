'use client'

import { createContext, ReactNode, useContext, useEffect, useRef } from 'react'

interface ChatState {
  socket: WebSocket | null
}

const ChatContext = createContext<ChatState | null>(null)

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    wsRef.current = new WebSocket('ws://chat/ws')
    return () => wsRef.current?.close()
  }, [])

  return (
    <ChatContext.Provider value={{ socket: wsRef.current }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChatContext = () => {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('Not inside provider')
  return ctx
}
