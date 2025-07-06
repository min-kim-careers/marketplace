import { ChatMessageMode } from '@/lib/enums/chat-message-type'
import { IChatMessageChat } from '@/lib/interfaces/chat-message-chat'

export interface IChatMessageRestore {
  mode: ChatMessageMode
  messages: IChatMessageChat[]
}
