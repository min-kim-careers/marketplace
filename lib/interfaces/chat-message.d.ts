import { ChatMessageType } from "@/lib/enums/chat-message-type"

export interface IChatMessage {
  id?: number
  mode: ChatMessageType
  roomId: string
  createdAt?: Date
  data?: any
}