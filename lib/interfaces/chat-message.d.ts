import { ChatMessageMode } from '@/lib/enums/chat-message-mode'

export interface IChatMessage {
  mode: ChatMessageMode
}
export interface IChatMessageRestored {
  mode: ChatMessageMode
  messages: IChatMessageChat[]
}

export interface IChatMessageRestore {
  mode: ChatMessageMode
  createdAt: string
}

export interface IChatMessageChat {
  mode: ChatMessageMode
  createdAt: string
  isMine: boolean
  content: any

  id?: string
  roomSlug?: string
  clientId?: string
  read?: boolean
}

export interface IChatMessageJoin {
  mode: ChatMessageMode
  roomSlug: string
}
