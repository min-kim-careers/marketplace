import { ChatMessage } from '@/lib/types/chat-message'
import { ChatPayload } from '@/lib/types/chat-payload'
import { Dispatch, SetStateAction } from 'react'

export const handleChatPayload = (
  payload: ChatPayload,
  handlers: { setMessages: Dispatch<SetStateAction<ChatMessage[]>> },
) => {
  const { setMessages } = handlers

  switch (payload.type) {
    case 'history':
      setMessages((prev) => [...prev, ...payload.data])
      console.log('set messages');
      
      break

    case 'message':
      setMessages((prev) => [...prev, payload.data])
      break

    default:
      break
  }
}
