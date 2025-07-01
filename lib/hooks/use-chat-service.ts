'use client'

import { ChatMessageType } from '@/lib/enums/chat-message-type'
import { IChatMessage } from '@/lib/interfaces/chat-message'
import { IChatSession } from '@/lib/interfaces/chat-session'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export function useChatService({
  token,
  session,
}: {
  token: string
  session: IChatSession
}) {
  const wsRef = useRef<WebSocket | null>(null)

  const [messages, setMessages] = useState<IChatMessage[]>(
    [],
  )
  const [loading, setLoading] = useState<boolean>(false)
  const [noMessages, setNoMessages] =
    useState<boolean>(false)

  useEffect(() => {
    if (!token) return

    try {
      setLoading(true)
      const url = `${process.env.NEXT_PUBLIC_CHAT_WS}?${new URLSearchParams({ token })}`
      console.log('Initializing websocket')
      const ws = new WebSocket(url)
      wsRef.current = ws

      ws.onopen = handleOnOpen
      ws.onmessage = handleOnMessage
      ws.onclose = handleOnClose
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }

    return () => {
      wsRef.current?.close()
    }
  }, [])

  const handleOnOpen = () => {
    console.log(`Connected to chat server`)
    if (handleSend(ChatMessageType.CONNECT)) {
      handleSend(ChatMessageType.RESTORE)
    }
  }

  const handleOnMessage = (event: MessageEvent<any>) => {
    const newMessage: IChatMessage = JSON.parse(event.data)
    console.log('Received message:', newMessage)

    switch (newMessage.mode) {
      case ChatMessageType.CHAT: {
        setMessages((prev) => [newMessage, ...prev])
        break
      }

      case ChatMessageType.RESTORE: {
        if (!!!newMessage.data) {
          break
        }

        const restoredMessages: IChatMessage[] =
          newMessage.data

        if (!!!restoredMessages.length) {
          setNoMessages(true)
          break
        }

        setMessages((prev) => [
          ...prev,
          ...restoredMessages,
        ])

        toast(
          `Restored ${restoredMessages.length} messages`,
        )
        break
      }

      default: {
        break
      }
    }
  }

  const handleOnClose = (event: CloseEvent) => {
    console.log('WebSocket connection closed')
    if (event.wasClean) {
      console.log(
        `Closed cleanly, code=${event.code}, reason=${event.reason}`,
      )
    } else {
      console.error(
        `Connection died, code=${event.code}, reason=${event.reason}`,
      )
    }
  }

  const sendChat = (text: string) => {
    const message = handleSend(ChatMessageType.CHAT, text)
    setMessages((prev) => [message, ...prev])
  }

  const handleSend = (
    messageType: ChatMessageType,
    data?: any,
  ): IChatMessage => {
    const message: IChatMessage = {
      ...session,
      mode: messageType,
      data,
    }
    wsRef.current?.send(JSON.stringify(message))

    console.log('Message sent:', message)
    return message
  }


  return { messages, sendChat, noMessages, loading }
}
