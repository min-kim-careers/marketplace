'use client'

import { ChatTextIn } from '@/chat/types/chat-inbound'
import { ChatRoom } from '@/chat/types/chat-room'
import { ChatStatus } from '@/chat/types/chat-status'
import { toPath } from '@/lib/helpers/to-path'
import { create } from 'zustand'

const defaultProps: ChatProps = {
  url: undefined,
  currentRoom: undefined,
  since: undefined,

  open: false,
  status: 'disconnected',
  messages: [],
  noMessages: false,
}

type ChatProps = {
  url?: string
  currentRoom?: ChatRoom
  since?: string

  open: boolean
  status: ChatStatus
  messages: ChatTextIn[]
  noMessages: boolean
}

type ChatState = {
  setUrl: (token?: string) => void
  setCurrentRoom: (currentRoom?: ChatRoom) => void
  setSince: (since?: string) => void

  setOpen: (open: boolean) => void
  setStatus: (status: ChatStatus) => void
  setMessages: (messages: ChatTextIn[]) => void
  setNoMessages: (noMessages: boolean) => void
} & ChatProps

const useChatStore = create<ChatState>((set) => {
  const _buildUrl = (token: string) =>
    toPath('ws://192.168.8.103/chat/ws', {
      token,
    })

  const setUrl = (token?: string) => {
    if (token) {
      const url = _buildUrl(token)
      set({ url })
    } else {
      set({ url: undefined })
    }
  }

  return {
    ...defaultProps,

    setUrl,
    setCurrentRoom: (currentRoom?: ChatRoom) => set({ currentRoom }),
    setSince: (since?: string) => set({ since }),

    setOpen: (open: boolean) => set({ open }),
    setStatus: (status: ChatStatus) => set({ status }),
    setMessages: (messages: ChatTextIn[]) => set({ messages }),
    setNoMessages: (noMessages: boolean) => set({ noMessages }),
  }
})

export default useChatStore
