import { ChatMessageType } from "@/lib/enums/chat-message-type"

export interface IChatMessage {
  messageType: ChatMessageType
  clientId: string
  timestamp?: string
  messageContent?: any
}