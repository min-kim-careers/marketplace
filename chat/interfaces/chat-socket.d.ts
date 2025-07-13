'use client'
import { ChatModeMessage } from '@/chat/types/chat-message'

export interface ChatSocket {
  senders: {
    sendChat: (text: string) => void
    sendTyping: () => void
    sendNotTyping: () => void
    sendRestore: () => void
  }
  isChatting: () => boolean
  setRoomId: (roomId: string | null) => void

  messages: ChatModeMessage[]
  noMessages: boolean
  isTyping: boolean
}
