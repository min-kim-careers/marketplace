'use client'

import { ChatMessageMode } from '@/lib/enums/chat-message-type'
import { IChatMessage } from '@/lib/interfaces/chat-message'
import { IChatRoom } from '@/lib/interfaces/chat-session'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export function useChatService({
  token,
  session,
}: {
  token: string
  session: IChatRoom
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
    if (
      !!handleSend({ mode: ChatMessageMode.CONNECT }) &&
      !messages.length
    ) {
      handleSend({
        mode: ChatMessageMode.RESTORE,
        createdAt: new Date().toISOString(),
      })
    }
  }

  const handleOnMessage = (event: MessageEvent<any>) => {
    const newMessage: IChatMessage = JSON.parse(event.data)
    console.log('Received message:', newMessage)

    switch (newMessage.mode) {
      case ChatMessageMode.CHAT: {
        setMessages((prev) => [newMessage, ...prev])
        break
      }

      case ChatMessageMode.RESTORE: {
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

        toast(`Restored messages`)
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
    const message = handleSend({
      mode: ChatMessageMode.CHAT,
      data: text,
    })
    setMessages((prev) => [message, ...prev])
  }

  const handleSend = (
    message: IChatMessage,
  ): IChatMessage => {
    const _message: IChatMessage = {
      ...message,
      roomId: session.roomId,
    }
    wsRef.current?.send(JSON.stringify(_message))

    console.log('Message sent:', _message)
    return _message
  }

  return { messages, sendChat, noMessages, loading }
}
