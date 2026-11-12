import { ChatTextIn } from '@/chat/types/chat-inbound'

export const flagMessageRead = (m: ChatTextIn, lastRead: Date): ChatTextIn => {
  m.read = new Date(m.timestamp) <= lastRead
  return m
}
