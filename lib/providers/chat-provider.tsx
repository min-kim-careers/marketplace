'use client'

import Chat from '@/components/chat'
import { handleChatPayload } from '@/lib/handlers/chat-message-handlers'
import { toPath } from '@/lib/helpers/to-path'
import useFirebaseStore from '@/lib/stores/firebase-store'
import { ChatMessage } from '@/lib/types/chat-message'
import { ChatPayload } from '@/lib/types/chat-payload'
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

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

interface ChatState {
  socket: WebSocket | null
  messages: ChatMessage[]
  send: (message: string) => void
  setRoomId: Dispatch<SetStateAction<string | null>>
}

const ChatContext = createContext<ChatState | null>(null)

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const token = useLoadToken()
  const [roomId, setRoomId] = useState<string | null>(null)

  const wsRef = useRef<WebSocket | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])

  useEffect(() => {
    if (token && roomId) {
      wsRef.current = new WebSocket(
        toPath('ws://localhost/chat/ws', { token, roomId }),
      )

      const ws = wsRef.current
      ws.onopen = () => console.log('Connected to WebSocket')
      ws.onclose = () => console.log('Disconnected from WebSocket')
      ws.onmessage = (e) => {
        const payload = JSON.parse(e.data) as ChatPayload
        console.log(payload)

        handleChatPayload(payload, { setMessages })
      }
    }

    return () => wsRef.current?.close()
  }, [token, roomId])

  return (
    <ChatContext.Provider
      value={{
        socket: wsRef.current,
        messages,
        send: (message: string) => wsRef.current?.send(JSON.stringify(message)),
        setRoomId,
      }}
    >
      {children}
      {token && roomId && <Chat />}
    </ChatContext.Provider>
  )
}

export const useChatContext = () => {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('Not inside provider')
  return ctx
}
