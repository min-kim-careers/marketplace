import { ChatMode } from '@/chat/enums/chat-mode'

export type ChatMessage =
  | {
      mode: ChatMode.CHAT
      createdAt: string
      isMine: boolean
      content: any
      id?: string
      read?: string
    }
  | {
      mode: ChatMode.RESTORE
      createdAt: string
    }
  | { mode: ChatMode.RESTORED; messages: ChatMessage[] }
  | { mode: ChatMode.CONNECTED }
  | { mode: ChatMode.DISCONNECT }
  | { mode: ChatMode.EMPTY }
  | { mode: ChatMode.INITIALIZING }
  | { mode: ChatMode.JOIN; roomSlug: string }
  | { mode: ChatMode.JOINED }
  | { mode: ChatMode.LEAVE }
  | { mode: ChatMode.LEFT }
  | { mode: ChatMode.TYPING }
  | { mode: ChatMode.NOT_TYPING }
