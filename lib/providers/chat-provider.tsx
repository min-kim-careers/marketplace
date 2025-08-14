'use client'

import { toPath } from '@/lib/helpers/to-path'
import useFirebaseStore from '@/lib/stores/firebase-store'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

interface ChatState {
  socket: WebSocket | null
  messages: any[]
  send: (message: string) => void
}

const ChatContext = createContext<ChatState | null>(null)

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const wsRef = useRef<WebSocket | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const { user } = useFirebaseStore()
  const [messages, setMessages] = useState<any[]>([])

  useEffect(() => {
    const loadToken = async () => {
      if (!token && user) {
        const token = await user?.getIdToken()
        if (token) setToken(token)
      }
    }

    loadToken()
  }, [user])

  useEffect(() => {
    if (token) {
      wsRef.current = new WebSocket(toPath('ws://localhost/chat/ws', { token }))
      const ws = wsRef.current

      ws.onopen = () => console.log('Connected to WebSocket')
      ws.onclose = () => console.log('Disconnected from WebSocket')
      ws.onmessage = (e) => setMessages((prev) => [...prev, JSON.parse(e.data)])
    }

    return () => wsRef.current?.close()
  }, [token])

  return (
    <ChatContext.Provider
      value={{
        socket: wsRef.current,
        messages,
        send: (message: string) => wsRef.current?.send(JSON.stringify(message)),
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChatContext = () => {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('Not inside provider')
  return ctx
}
