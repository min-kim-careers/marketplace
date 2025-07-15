import { ChatMode } from '@/chat/enums/chat-mode'

export type ChatMessageOutChat = {
  mode: ChatMode.CHAT
  content: any
}

export type ChatMessageOutRestore = {
  mode: ChatMode.RESTORE
}

export type ChatMessageOutJoin = { mode: ChatMode.JOIN; roomSlug: string }

export type ChatMessageOutEvent = {
  mode:
    | ChatMode.DISCONNECT
    | ChatMode.JOINED
    | ChatMode.LEAVE
    | ChatMode.TYPING
    | ChatMode.NOT_TYPING
}

export type ChatMessageOut =
  | ChatMessageOutChat
  | ChatMessageOutRestore
  | ChatMessageOutJoin
  | ChatMessageOutEvent
