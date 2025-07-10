'use client'

import { ChatMode } from '@/lib/enums/chat-mode'
import { useLoadToken } from '@/lib/firebase/use-load-token'
import { IChatRoomWithItem } from '@/lib/interfaces/chat-room'
import { ChatMessage } from '@/lib/types/chat-message'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export interface IChatSocket {
  sendChat: (text: string) => void
  isChatting: () => boolean

  messages: ChatMessage[]
  noMessages: boolean
}

export function useChatSocket(
  currentRoom: IChatRoomWithItem | null,
): IChatSocket {
  const token = useLoadToken()

  const wsRef = useRef<WebSocket | null>(null)

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [mode, setMode] = useState<ChatMode>(ChatMode.INITIALIZING)

  useEffect(() => {
    if (!token) return

    try {
      const url = `${process.env.NEXT_PUBLIC_CHAT_WS}?${new URLSearchParams({ token })}`
      console.log('Initializing websocket')
      const ws = new WebSocket(url)
      wsRef.current = ws

      ws.onopen = () => {}
      ws.onmessage = (event: MessageEvent<any>) => {
        const newMessage: ChatMessage = JSON.parse(event.data)
        console.log('Received message:', newMessage)
        switch (newMessage.mode) {
          case ChatMode.CHAT: {
            handleChatMessage(newMessage)
            break
          }
          case ChatMode.EMPTY: {
            handleEmptyMessage()
            break
          }
          case ChatMode.RESTORED: {
            handleRestoredMessage(newMessage)
            break
          }
          case ChatMode.CONNECTED: {
            handleConnectedMessage()
            break
          }

          case ChatMode.JOINED: {
            handleJoinedMessage()
            break
          }
          case ChatMode.LEFT: {
            handleLeftMessage()
            break
          }
          default: {
            console.log('Invalid message:', event.data)
            break
          }
        }
      }
      ws.onclose = (event: CloseEvent) =>
        console.log(`WebSocket connection closed. Clean: ${event.wasClean}`)
    } catch (error) {
      throw error
    }

    return () => wsRef.current?.close()
  }, [token])

  const [noMessages, setNoMessages] = useState<boolean>(false)
  // ----------------------------- Message handlers -----------------------------

  const handleChatMessage = (message: ChatMessage) => {
    setMessages((prev) => [message, ...prev])
  }

  const handleEmptyMessage = () => {
    setNoMessages(true)
  }

  const handleRestoredMessage = (message: ChatMessage) => {
    if (message.mode === ChatMode.RESTORED) {
      if (!message.messages.length) return setNoMessages(true)
      setMessages((prev) => [...prev, ...message.messages])
      toast(`Restored messages`)
    }
  }

  const handleConnectedMessage = () => {
    if (currentRoom) {
      sendMessage({
        mode: ChatMode.JOIN,
        roomSlug: currentRoom.id,
      })
    }
  }

  const handleJoinedMessage = () => {
    !messages.length &&
      sendMessage({
        mode: ChatMode.RESTORE,
        createdAt: new Date().toISOString(),
      })
  }

  const handleLeftMessage = () => {
    setMessages([])
  }

  // ----------------------------------------------------------------------------

  const sendMessage = (message: ChatMessage) => {
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify(message))
      console.log('Message sent:', message)
    }
    if (message.mode !== ChatMode.CHAT) {
      setMode(message.mode)
    }
    return message
  }

  const sendChat = (text: string) =>
    setMessages((prev) => [
      sendMessage({
        mode: ChatMode.CHAT,
        createdAt: new Date().toISOString(),
        content: text,
        isMine: true,
      }),
      ...prev,
    ])

  const isChatting = () =>
    (mode && [ChatMode.JOINED, ChatMode.RESTORED].includes(mode)) ?? false

  return {
    sendChat,
    isChatting,

    messages,
    noMessages,
  }
}
