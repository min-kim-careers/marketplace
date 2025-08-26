import { ChatMessage } from '@/lib/types/chat-message'

export type ChatPayload =
  | { type: 'previous'; data: ChatMessage[] }
  | { type: 'messages'; data: ChatMessage[] }
  | { type: 'join'; data: { roomId: string } }
