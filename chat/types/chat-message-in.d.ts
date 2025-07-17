import { ChatMode } from '@/chat/enums/chat-mode'

export type ChatMessageInChat = {
  id?: string
  tempId: string
  mode: ChatMode.CHAT
  createdAt: string
  isMine: boolean
  content: any
  sent: boolean
  read: boolean
}

export type ChatMessageInRestored = {
  mode: ChatMode.RESTORED
  messages: ChatMessageInChat[]
}

export type ChatModeEventIn = {
  mode:
    | ChatMode.CONNECTED
    | ChatMode.JOINED
    | ChatMode.LEFT
    | ChatMode.TYPING
    | ChatMode.NOT_TYPING
    | ChatMode.NO_MESSAGES
}

export type ChatMessageIn =
  | ChatMessageInChat
  | ChatMessageInRestored
  | ChatModeEventIn
