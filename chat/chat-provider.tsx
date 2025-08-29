'use client'

import useChatStore from '@/chat/chat-store'
import { toPath } from '@/lib/helpers/to-path'
import useFirebaseStore from '@/lib/stores/firebase-store'
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { WebSocketHook } from 'react-use-websocket/dist/lib/types'

const useLoadToken = () => {
  const { user } = useFirebaseStore()
  const [token, setToken] = useState<string | null>(null)
  useEffect(() => {
    const loadToken = async () => {
      if (!token && user) {
        const token = await user?.getIdToken()
        if (token) setToken(token)
      }
    }

    loadToken()
  }, [user])

  return token
}

const readyStateMap = {
  [ReadyState.CONNECTING]: 'Connecting',
  [ReadyState.OPEN]: 'Open',
  [ReadyState.CLOSING]: 'Closing',
  [ReadyState.CLOSED]: 'Closed',
  [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
} as const

export interface ChatState extends WebSocketHook {}

const ChatContext = createContext<ChatState | null>(null)

const makeUrl = (token: string, roomAlias: string) =>
  toPath('ws://192.168.8.103/chat/ws', { token, roomAlias })

export default function ChatProvider({ children }: PropsWithChildren) {
  const token = useLoadToken()

  const [url, setUrl] = useState<string | null>(null)

  const { currentRoom, setMessages } = useChatStore()

  const wsHook = useWebSocket(url, {})

  useEffect(() => {
    if (token && currentRoom) {
      setUrl(makeUrl(token, currentRoom.alias))
    }
  }, [token, currentRoom])

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
