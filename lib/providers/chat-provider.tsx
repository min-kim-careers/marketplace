'use client'

import { IChatSession } from '@/lib/interfaces/chat-session'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

interface ChatProps {
  url: string
  sessions: IChatSession[]
} 

interface ChatState extends ChatProps {
  addSession: (session: IChatSession) => void
}

const ChatContext = createContext<ChatState | null>(null)

interface ChatProviderProps {
  url: string
}

export const ChatProvider = ({
  children,
  props,
}: {
  children: ReactNode
  props: ChatProviderProps
}) => {
  const [sessions, setSessions] = useState<IChatSession[]>(
    [],
  )

  useEffect(() => {
    setSessions([])
  }, [])

  return (
    <ChatContext.Provider
      value={{
        ...props,
        sessions,
        addSession: (session: IChatSession) => {
          setSessions((prev) => [session, ...prev])
        },
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChatContext = () => {
  const context = useContext(ChatContext)
  if (!context) throw new Error('Not inside provider')
  return context
}
