import { ChatTextIn } from '@/chat/types/chat-inbound'

// returns a new object when the flag changes so React sees the update;
// only own messages carry a read indicator, and read never reverts to unread
export const flagMessageRead = (m: ChatTextIn, lastRead: Date): ChatTextIn => {
  if (!m.mine || m.read) return m
  return new Date(m.timestamp) <= lastRead ? { ...m, read: true } : m
}
