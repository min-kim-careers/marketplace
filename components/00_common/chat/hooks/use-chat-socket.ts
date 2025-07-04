'use client'

import { ChatMessageMode } from '@/lib/enums/chat-message-type'
import { IChatMessage } from '@/lib/interfaces/chat-message'
import { IChatRoom } from '@/lib/interfaces/chat-room'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export function useChatSocket({
  token,
  room,
}: {
  token: string
  room: IChatRoom | null
}) {
  const wsRef = useRef<WebSocket | null>(null)

  const [messages, setMessages] = useState<IChatMessage[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (room) sendMessage({ mode: ChatMessageMode.JOIN, roomId: room.id })
  }, [room])

  useEffect(() => {
    try {
      setLoading(true)
      const url = `${process.env.NEXT_PUBLIC_CHAT_WS}?${new URLSearchParams({ token })}`
      console.log('Initializing websocket')
      const ws = new WebSocket(url)
      wsRef.current = ws

      ws.onopen = () => {}
      ws.onmessage = (event: MessageEvent<any>) => {
        const newMessage: IChatMessage = JSON.parse(event.data)
        console.log('Received message:', newMessage)
        switch (newMessage.mode) {
          case ChatMessageMode.CHAT: {
            handleChatMessage(newMessage)
            break
          }
          case ChatMessageMode.RESTORED: {
            handleRestoredMessage(newMessage)
            break
          }
          case ChatMessageMode.CONNECTED: {
            handleConnectedMessage()
            break
          }
          case ChatMessageMode.EMPTY: {
            handleEmptyMessage()
            break
          }
          case ChatMessageMode.JOINED: {
            handleJoinedMessage()
            break
          }
          case ChatMessageMode.LEFT: {
            handleLeftMessage()
            break
          }
          default: {
            console.log('Invalid message mode')
            break
          }
        }
      }
      ws.onclose = (event: CloseEvent) =>
        console.log(`WebSocket connection closed. Clean: ${event.wasClean}`)
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }

    return () => {
      wsRef.current?.close()
    }
  }, [])

  const [isChatting, setIsChatting] = useState<boolean>(false)
  const [noMessages, setNoMessages] = useState<boolean>(false)
  // ----------------------------- Message handlers -----------------------------

  const handleChatMessage = (message: IChatMessage) => {
    setMessages((prev) => [message, ...prev])
  }

  const handleRestoredMessage = (message: IChatMessage) => {
    if (!message.data) return
    const restoredMessages: IChatMessage[] = message.data
    if (!restoredMessages.length) return setNoMessages(true)
    setMessages((prev) => [...prev, ...restoredMessages])
    toast(`Restored messages`)
  }

  const handleConnectedMessage = () => {
    if (room) sendMessage({ mode: ChatMessageMode.JOIN, roomId: room.id })
  }

  const handleEmptyMessage = () => {
    setNoMessages(true)
  }

  const handleJoinedMessage = () => {
    !messages.length &&
      sendMessage({
        mode: ChatMessageMode.RESTORE,
        createdAt: new Date().toISOString(),
      })
    setIsChatting(true)
  }

  const handleLeftMessage = () => {
    setIsChatting(false)
    setMessages([])
  }

  // ----------------------------------------------------------------------------

  const sendMessage = (message: IChatMessage) => {
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify(message))
      console.log('Message sent:', message)
    }
    return message
  }

  return {
    messages,
    sendChat: (text: string) =>
      setMessages((prev) => [
        sendMessage({
          mode: ChatMessageMode.CHAT,
          data: text,
          isMine: true,
        }),
        ...prev,
      ]),
    leaveChat: () => sendMessage({ mode: ChatMessageMode.LEAVE }),
    isChatting,
    noMessages,
    loading,
  }
}
