'use client'

import { IChatRoom } from '@/lib/interfaces/chat-room'
import {
  createContext,
  ReactNode,
  useContext,
  useRef
} from 'react'
import { createStore, StoreApi, useStore } from 'zustand'

interface ChatPageProps {
  currentRoom: IChatRoom | null
  existingRooms: IChatRoom[]
}

interface ChatPageState extends ChatPageProps {
}

const ChatPageContext = createContext<StoreApi<ChatPageState> | null>(null)

export const ChatPageProvider = ({
  children,
  props,
}: {
  children: ReactNode
  props: ChatPageProps
}) => {
  const storeRef = useRef(
    createStore<ChatPageState>((set, get) => ({
      ...props,
    })),
  )

  return (
    <ChatPageContext.Provider value={storeRef.current}>
      {children}
    </ChatPageContext.Provider>
  )
}

export const useChatPageStore = <T,>(selector: (state: ChatPageState) => T) => {
  const store = useContext(ChatPageContext)
  if (!store) throw new Error('Not inside provider')
  return useStore(store, selector)
}
