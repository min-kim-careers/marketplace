'use client'

import { useChatHandler } from '@/chat/chat-handlers'
import useChatStore from '@/chat/chat-store'
import { readyStateMap } from '@/chat/ready-state-map'
import { useLoadToken } from '@/chat/use-load-token'
import { toPath } from '@/lib/helpers/to-path'
import { createContext, PropsWithChildren, useContext, useEffect } from 'react'
import useWebSocket from 'react-use-websocket'
import { WebSocketHook } from 'react-use-websocket/dist/lib/types'

export type ChatState = WebSocketHook

const ChatContext = createContext<ChatState | null>(null)

const _makeUrl = (token: string) =>
  toPath('ws://192.168.8.103/chat/ws', { token })

export default function ChatProvider({ children }: PropsWithChildren) {
  const token = useLoadToken()

  const { url, setUrl, currentRoom, setMessages } = useChatStore()

  const wsHook = useWebSocket(url, {
    onOpen: async (e: Event) => {},
  })

  const { handleJoin } = useChatHandler(wsHook)

  useEffect(() => {
    if (token) setUrl(_makeUrl(token))
  }, [token])

  useEffect(() => {
    if (currentRoom) handleJoin()
  }, [currentRoom])

  useEffect(
    () => console.log(readyStateMap[wsHook.readyState]),
    [wsHook.readyState],
  )

  return (
    <ChatContext.Provider value={{ ...wsHook }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChatContext = () => {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('Not inside provider')
  return ctx
}
