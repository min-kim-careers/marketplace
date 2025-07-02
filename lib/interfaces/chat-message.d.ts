import { ChatMessageMode } from "@/lib/enums/chat-message-type"

export interface IChatMessage {
  // id?: number
  mode: ChatMessageMode
  roomId?: string
  clientId?: string
  createdAt?: string
  data?: any
}