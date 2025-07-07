import { ChatMessageMode } from '@/lib/enums/chat-message-type'

export interface IChatMessage {
  mode: ChatMessageMode
}
export interface IChatMessageRestore {
  mode: ChatMessageMode
  messages: IChatMessageChat[]
}
export interface IChatMessageChat {
  mode: ChatMessageMode
  id: string
  roomId: string
  clientId: string
  createdAt: string
  read: boolean
  isMine: boolean
  content: any
}
