import { ChatMode } from '@/lib/enums/chat-mode'

export type ChatMessage =
  | {
      mode: ChatMode.CHAT
      createdAt: string
      isMine: boolean
      content: any
      id?: string
      read?: string
    }
  | { mode: ChatMode.CONNECTED }
  | { mode: ChatMode.DISCONNECT }
  | { mode: ChatMode.EMPTY }
  | { mode: ChatMode.INITIALIZING }
  | { mode: ChatMode.JOIN; roomSlug: string }
  | { mode: ChatMode.JOINED }
  | { mode: ChatMode.LEAVE }
  | { mode: ChatMode.LEFT }
  | {
      mode: ChatMode.RESTORE
      createdAt: string
    }
  | { mode: ChatMode.RESTORED; messages: ChatMessage[] }
