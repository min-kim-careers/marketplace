'use client'

import { ChatSocketState, useChatSocket } from '@/chat/hooks/use-chat-socket'
import { useLoadToken } from '@/chat/hooks/use-load-token'
import useChatStore from '@/chat/stores/chat-store'
import { toPath } from '@/lib/helpers/to-path'
import { createContext, PropsWithChildren, useContext, useEffect } from 'react'

export type ChatState = ChatSocketState

const ChatContext = createContext<ChatState | null>(null)

const _makeUrl = (token: string, sessionId?: string) =>
  toPath('ws://192.168.8.103/chat/ws', {
    token,
    ...(sessionId && { sessionId }),
  })

export default function ChatProvider({ children }: PropsWithChildren) {
  const token = useLoadToken()

  const { setUrl } = useChatStore()
  const sessionId = useChatStore((state) => state.sessionId)

  const socket = useChatSocket()

  useEffect(() => {
    if (token) setUrl(_makeUrl(token, sessionId ?? undefined))
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
