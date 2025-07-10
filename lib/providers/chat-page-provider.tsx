'use client'

import { IChatRoomWithItem } from '@/lib/interfaces/chat-room'
import { createContext, ReactNode, useContext, useEffect, useRef } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'

interface ChatPageProps {
  currentRoom: IChatRoomWithItem | null
  existingRooms: IChatRoomWithItem[]
}

interface ChatPageState extends ChatPageProps {
  setCurrentRoom: (currentRoom: IChatRoomWithItem) => void
  setExistingRooms: (existingRooms: IChatRoomWithItem[]) => void
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
    createStore<ChatPageState>((set) => ({
      ...props,
      setCurrentRoom: (currentRoom: IChatRoomWithItem) => set({ currentRoom }),
      setExistingRooms: (existingRooms: IChatRoomWithItem[]) =>
        set({ existingRooms }),
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

// export const useChatPageStore = <T,>(selector: (state: ChatPageState) => T) => {
//   const store = useContext(ChatPageContext)
//   if (!store) throw new Error('Not inside provider')
//   return useStore(store, selector)
// }

export const useChatPageStore = () => {
  const store = useContext(ChatPageContext)
  if (!store) throw new Error('Not inside provider')
  return useStore(store)
}
