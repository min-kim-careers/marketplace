import { ChatMessageType } from "@/lib/enums/chat-message-type"

export interface IChatMessage {
  id?: number
  messageType: ChatMessageType
  clientId: string
  roomId: string
  createdAt?: string
  data?: any
}