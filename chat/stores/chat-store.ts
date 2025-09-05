'use client'

import { ChatTextIn } from '@/chat/types/chat-inbound'
import { ChatRoom } from '@/chat/types/chat-room'
import { create } from 'zustand'

interface ChatState {
  url: string | null
  setUrl: (url: string | null) => void

  sessionId: string | null
  setSessionId: (sessionId: string | null) => void

  currentRoom?: ChatRoom
  setCurrentRoom: (currentRoom?: ChatRoom) => void

  joinedRoom: boolean
  setJoinedRoom: (joinedRoom: boolean) => void

  messages: ChatTextIn[]
  setMessages: (messages: ChatTextIn[]) => void

  noMessages: boolean
  setNoMessages: (noMessages: boolean) => void
}

const useChatStore = create<ChatState>((set) => ({
  url: null,
  setUrl: (url: string | null) => set({ url }),

  sessionId: null,
  setSessionId: (sessionId: string | null) => set({ sessionId }),

  setCurrentRoom: (currentRoom?: ChatRoom) => set({ currentRoom }),

  joinedRoom: false,
  setJoinedRoom: (joinedRoom: boolean) => set({ joinedRoom }),

  messages: [],
  setMessages: (messages: ChatTextIn[]) => set({ messages }),

  noMessages: false,
  setNoMessages: (noMessages: boolean) => set({ noMessages }),
}))

export default useChatStore
