'use client'

import { IChatRoom } from '@/lib/interfaces/chat-room'
import { createContext, ReactNode, useContext, useEffect, useRef } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'

interface ChatPageProps {
  currentRoom: IChatRoom | null
  existingRooms: IChatRoom[]
}

interface ChatPageState extends ChatPageProps {
  setCurrentRoom: (currentRoom: IChatRoom) => void
  setExistingRooms: (existingRooms: IChatRoom[]) => void
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
      setCurrentRoom: (currentRoom: IChatRoom) => set({ currentRoom }),
      setExistingRooms: (existingRooms: IChatRoom[]) => set({ existingRooms }),
    })),
  )

  useEffect(() => {
    storeRef.current.setState({ currentRoom: props.currentRoom })
  }, [props.currentRoom])

  useEffect(() => {
    storeRef.current.setState({ existingRooms: props.existingRooms })
  }, [props.existingRooms])

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
