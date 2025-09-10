'use client'

import { ChatTextIn } from '@/chat/types/chat-inbound'
import { ChatRoom } from '@/chat/types/chat-room'
import { ChatStatus } from '@/chat/types/chat-status'
import { create } from 'zustand'

const defaultProps: ChatProps = {
  url: undefined,
  currentRoom: undefined,
  since: undefined,

  status: 'disconnected',
  messages: [],
  noMessages: false,
}

type ChatProps = {
  url?: string
  currentRoom?: ChatRoom
  since?: string

  status: ChatStatus
  messages: ChatTextIn[]
  noMessages: boolean
}

type ChatState = {
  setUrl: (url?: string) => void
  setCurrentRoom: (currentRoom?: ChatRoom) => void
  setSince: (since?: string) => void

  setStatus: (status: ChatStatus) => void
  setMessages: (messages: ChatTextIn[]) => void
  setNoMessages: (noMessages: boolean) => void
} & ChatProps

const useChatStore = create<ChatState>((set) => ({
  ...defaultProps,

  setUrl: (url?: string) => set({ url }),
  setCurrentRoom: (currentRoom?: ChatRoom) => set({ currentRoom }),
  setSince: (since?: string) => set({ since }),

  setStatus: (status: ChatStatus) => set({ status }),
  setMessages: (messages: ChatTextIn[]) => set({ messages }),
  setNoMessages: (noMessages: boolean) => set({ noMessages }),
}))

export default useChatStore
