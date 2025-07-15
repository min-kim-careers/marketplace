'use client'
import { ChatMessageInChat } from '@/chat/types/chat-message-in'

export interface ChatSocket {
  senders: {
    sendChat: (text: string) => void
    sendTyping: () => void
    sendNotTyping: () => void
    sendRestore: () => void
  }
  isChatting: () => boolean
  setRoomId: (roomId: string | null) => void

  chatMessages: ChatMessageInChat[]
  noMessages: boolean
  isTyping: boolean
}
