import { ChatMode } from '@/chat/enums/chat-mode'

export type ChatModeMessage = {
  mode: ChatMode.CHAT
  createdAt: string
  isMine: boolean
  content: any
  id?: string
  read?: string
}

export type ChatMessage =
  | ChatTypeMessage
  | {
      mode: ChatMode.RESTORE
      createdAt: string
    }
  | { mode: ChatMode.RESTORED; messages: ChatTypeMessage[] }
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
