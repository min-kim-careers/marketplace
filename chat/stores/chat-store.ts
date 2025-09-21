'use client'

import { ChatTextIn } from '@/chat/types/chat-inbound'
import { ChatRoom } from '@/chat/types/chat-room'
import { ChatStatus } from '@/chat/types/chat-status'
import { toPath } from '@/lib/helpers/to-path'
import { create } from 'zustand'

const defaultProps: ChatProps = {
  peerTyping: false,
  peerlastRead: new Date(0).toISOString(),
  open: false,
  status: 'disconnected',
  messages: [],
  noMessages: false,
}

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
}

type ChatState = {
  setUrl: (token?: string) => void
  setProps: (props: Partial<ChatProps>) => void
} & ChatProps

const useChatStore = create<ChatState>((set) => {
  return {
    ...defaultProps,

    setUrl: (token?: string) =>
      set({
        url: token
          ? toPath('ws://192.168.8.103/chat/ws', {
              token,
            })
          : undefined,
      }),
    setProps: (props: Partial<ChatProps>) => set({ ...props }),
  }
})

export default useChatStore
