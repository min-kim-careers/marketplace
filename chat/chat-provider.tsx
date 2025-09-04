'use client'

import useChatStore from '@/chat/chat-store'
import { useChatSocket } from '@/chat/use-chat-socket'
import { useLoadToken } from '@/chat/use-load-token'
import { toPath } from '@/lib/helpers/to-path'
import { createContext, PropsWithChildren, useContext, useEffect } from 'react'

export type ChatState = {
  sendTextMessage: (message: string) => void
}

const ChatContext = createContext<ChatState | null>(null)

const _makeUrl = (token: string) =>
  toPath('ws://192.168.8.103/chat/ws', { token })

export default function ChatProvider({ children }: PropsWithChildren) {
  const token = useLoadToken()

  const { url, setUrl, currentRoom, setMessages } = useChatStore()

  const socket = useChatSocket()

  useEffect(() => {
    if (token) setUrl(_makeUrl(token))
  }, [token])

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
