'use client'

import { ChatMessage } from '@/chat/chat-message'
import { ChatRoom } from '@/chat/chat-room'
import { create } from 'zustand'

interface ChatState {
  url: string | null
  setUrl: (url: string | null) => void

  currentRoom?: ChatRoom
  setCurrentRoom: (currentRoom?: ChatRoom) => void

  messages: ChatMessage[]
  setMessages: (messages: ChatMessage[]) => void
}

const useChatStore = create<ChatState>((set) => ({
  url: null,
  setUrl: (url: string | null) => set({ url }),

  setCurrentRoom: (currentRoom?: ChatRoom) => set({ currentRoom }),

  messages: [],
  setMessages: (messages: ChatMessage[]) => set({ messages }),
}))

export default useChatStore
