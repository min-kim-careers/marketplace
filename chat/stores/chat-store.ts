'use client'

import { ChatTextIn } from '@/chat/types/chat-inbound'
import { ChatRoom } from '@/chat/types/chat-room'
import { ChatStatus } from '@/chat/types/chat-status'
import { toPath } from '@/lib/helpers/to-path'
import { create } from 'zustand'

type ChatProps = {
  url?: string
  currentRoom?: ChatRoom
  since?: string

  peerTyping: boolean
  peerlastRead: string
  open: boolean
  status: ChatStatus
  messages: ChatTextIn[]
  noMessages: boolean
  rooms: ChatRoom[]
}

type ChatState = {
  setUrl: (token?: string) => void
  setProps: (props: Partial<ChatProps>) => void
  clearState: () => void
} & ChatProps

const useChatStore = create<ChatState>((set) => {
  return {
    peerTyping: false,
    peerlastRead: new Date(0).toISOString(),
    open: false,
    status: 'disconnected',
    messages: [],
    noMessages: false,
    rooms: [],

    setUrl: (token?: string) =>
      set({
        url: token
          ? toPath('ws://192.168.8.103/chat/ws', {
              token,
            })
          : undefined,
      }),
    setProps: (props: Partial<ChatProps>) => set({ ...props }),
    clearState: () =>
      set({
        peerTyping: false,
        peerlastRead: new Date(0).toISOString(),
        messages: [],
        noMessages: false,
      }),
  }
})

export default useChatStore
