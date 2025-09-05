'use client'

import { ChatMessageIn } from '@/chat/types/chat-inbound'
import { ChatRoom } from '@/chat/types/chat-room'
import { create } from 'zustand'

interface ChatState {
  url: string | null
  setUrl: (url: string | null) => void

  currentRoom?: ChatRoom
  setCurrentRoom: (currentRoom?: ChatRoom) => void

  joinedRoom: boolean
  setJoinedRoom: (joinedRoom: boolean) => void

  messages: ChatMessageIn[]
  setMessages: (messages: ChatMessageIn[]) => void
  addMessage: (message: ChatMessageIn) => void
}

const useChatStore = create<ChatState>((set) => ({
  url: null,
  setUrl: (url: string | null) => set({ url }),

  setCurrentRoom: (currentRoom?: ChatRoom) => set({ currentRoom }),

  joinedRoom: false,
  setJoinedRoom: (joinedRoom: boolean) => set({ joinedRoom }),

  messages: [],
  setMessages: (messages: ChatMessageIn[]) => set({ messages }),
  addMessage: (message: ChatMessageIn) =>
    set((state) => ({ messages: [message, ...state.messages] })),
}))

export default useChatStore
