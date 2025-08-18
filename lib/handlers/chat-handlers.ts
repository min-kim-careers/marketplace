import { ChatMessage } from '@/lib/types/chat-message'
import { ChatPayload } from '@/lib/types/chat-payload'
import { Dispatch, SetStateAction } from 'react'

export const handleChatPayload = (
  payload: ChatPayload,
  handlers: { setMessages: Dispatch<SetStateAction<ChatMessage[]>> },
) => {
  const { setMessages } = handlers

  switch (payload.type) {
    case 'messages':
      setMessages((prev) => [...payload.data.reverse(), ...prev])
      break

    case 'previous':
      setMessages((prev) => [...prev, ...payload.data.reverse()])
      break


    default:
      break
  }
}
