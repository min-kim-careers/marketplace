'use client'

import { ChatRoom } from '@/chat/interfaces/chat-room'
import { useChatSocketContext } from '@/chat/providers/chat-socket-provider'
import { createContext, ReactNode, useContext, useEffect, useRef } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'

interface ChatPageProps {
  currentRoom: ChatRoom | null
  existingRooms: ChatRoom[]
}

interface ChatPageState extends ChatPageProps {
  setCurrentRoom: (currentRoom: ChatRoom) => void
  setExistingRooms: (existingRooms: ChatRoom[]) => void
}

const ChatPageContext = createContext<StoreApi<ChatPageState> | null>(null)

export const ChatPageProvider = ({
  children,
  props,
}: {
  children: ReactNode
  props: ChatPageProps
}) => {
  const { setRoomId } = useChatSocketContext()

  const storeRef = useRef(
    createStore<ChatPageState>((set) => ({
      ...props,
      setCurrentRoom: (currentRoom: ChatRoom) => set({ currentRoom }),
      setExistingRooms: (existingRooms: ChatRoom[]) =>
        set({ existingRooms }),
    })),
  )

  // useEffect(() => {
  //   setRoomId(props.currentRoom ? props.currentRoom.id : null)
  //   storeRef.current.setState({ currentRoom: props.currentRoom })
  // }, [props.currentRoom])

  // useEffect(() => {
  //   storeRef.current.setState({ existingRooms: props.existingRooms })
  // }, [props.existingRooms])

  return (
    <ChatPageContext.Provider value={storeRef.current}>
      {children}
    </ChatPageContext.Provider>
  )
}

export const useChatPageStore = () => {
  const store = useContext(ChatPageContext)
  if (!store) throw new Error('Not inside provider')
  return useStore(store)
}
