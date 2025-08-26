'use client'

import ChatWindow from '@/components/chat/chat-window'
import { handleChatPayload } from '@/lib/handlers/chat-handlers'
import { toPath } from '@/lib/helpers/to-path'
import useFirebaseStore from '@/lib/stores/firebase-store'
import { ChatMessage } from '@/lib/types/chat-message'
import { ChatPayload } from '@/lib/types/chat-payload'
import { ChatRoom } from '@/lib/types/chat-room'
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react'
import useWebSocket from 'react-use-websocket'
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

interface ChatState {
  hook: WebSocketHook
  messages: ChatMessage[]
  room: ChatRoom | null
  setRoom: Dispatch<SetStateAction<ChatRoom | null>>
}

const ChatContext = createContext<ChatState | null>(null)

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const token = useLoadToken()
  const [room, setRoom] = useState<ChatRoom | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [url, setUrl] = useState<string | null>(null)

  const ws = useWebSocket(url, {
    onOpen: () => {
      console.log('Connected to WebSocket')
      
    },
    onMessage: (e) => {
      const payload = JSON.parse(e.data) as ChatPayload
      console.log(payload)
      handleChatPayload(payload, { setMessages })
    },
    onClose: () => {
      setRoom(null)
      setMessages([])
      setUrl(null)
    },
  })

  useEffect(() => {
    if (token && room) {
      setUrl(toPath('ws://localhost/chat/ws', { token }))
    }
  }, [token, room])

  return (
    <ChatContext.Provider
      value={{
        hook: ws,
        messages,
        room,
        setRoom,
      }}
    >
      {children}
      {url && <ChatWindow />}
    </ChatContext.Provider>
  )
}

export const useChatContext = () => {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('Not inside provider')
  return ctx
}
