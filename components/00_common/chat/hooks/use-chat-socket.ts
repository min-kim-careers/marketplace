'use client'

import { APP_ROUTES } from '@/lib/constants/app-routes'
import { ChatMessageMode } from '@/lib/enums/chat-message-mode'
import { useLoadToken } from '@/lib/firebase/use-load-token'
import {
  IChatMessage,
  IChatMessageJoin,
  IChatMessageRestore,
} from '@/lib/interfaces/chat-message'
import { IChatMessageChat } from '@/lib/interfaces/chat-message'
import { IChatMessageRestored } from '@/lib/interfaces/chat-message'
import { useChatPageStore } from '@/lib/providers/chat-page-provider'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export function useChatSocket() {
  const router = useRouter()

  const token = useLoadToken()
  const currentRoom = useChatPageStore((store) => store.currentRoom)

  const wsRef = useRef<WebSocket | null>(null)

  const [messages, setMessages] = useState<IChatMessageChat[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (currentRoom) {
      sendMessage<IChatMessageJoin>({
        mode: ChatMessageMode.JOIN,
        roomSlug: currentRoom.id,
      })
    } else {
      setLoading(true)
      if (hasSession) sendMessage<IChatMessage>({ mode: ChatMessageMode.LEAVE })
      setHasSession(false)
      setMessages([])
    }
  }, [currentRoom])

  useEffect(() => {
    if (!token) return

    try {
      setLoading(true)
      const url = `${process.env.NEXT_PUBLIC_CHAT_WS}?${new URLSearchParams({ token })}`
      console.log('Initializing websocket')
      const ws = new WebSocket(url)
      wsRef.current = ws

      ws.onopen = () => {}
      ws.onmessage = (event: MessageEvent<any>) => {
        const data = JSON.parse(event.data)
        const newMessage: IChatMessage = data
        console.log('Received message:', newMessage)
        switch (newMessage.mode) {
          case ChatMessageMode.CHAT: {
            handleChatMessage(data as IChatMessageChat)
            break
          }
          case ChatMessageMode.RESTORED: {
            handleRestoredMessage(data as IChatMessageRestored)
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

    return () => wsRef.current?.close()
  }, [token])

  const [hasSession, setHasSession] = useState<boolean>(false)
  const [noMessages, setNoMessages] = useState<boolean>(false)
  // ----------------------------- Message handlers -----------------------------

  const handleChatMessage = (message: IChatMessageChat) => {
    setMessages((prev) => [message, ...prev])
  }

  const handleRestoredMessage = (message: IChatMessageRestored) => {
    if (!message.messages.length) return setNoMessages(true)
    setMessages((prev) => [...prev, ...message.messages])
    toast(`Restored messages`)
  }

  const handleConnectedMessage = () => {
    if (currentRoom) {
      sendMessage<IChatMessageJoin>({
        mode: ChatMessageMode.JOIN,
        roomSlug: currentRoom.id,
      })
      setLoading(true)
    }
  }

  const handleEmptyMessage = () => {
    setNoMessages(true)
  }

  const handleJoinedMessage = () => {
    !messages.length &&
      sendMessage<IChatMessageRestore>({
        mode: ChatMessageMode.RESTORE,
        createdAt: new Date().toISOString(),
      })
    setHasSession(true)
    setLoading(false)
  }

  const handleLeftMessage = () => {
    setHasSession(false)
    setMessages([])
    setLoading(false)
  }

  // ----------------------------------------------------------------------------

  const sendMessage = <T>(message: T) => {
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify(message))
      console.log('Message sent:', message)
    }
    return message as T
  }

  return {
    messages,
    sendChat: (text: string) =>
      setMessages((prev) => [
        sendMessage<IChatMessageChat>({
          mode: ChatMessageMode.CHAT,
          createdAt: new Date().toISOString(),
          content: text,
          isMine: true,
        }),
        ...prev,
      ]),
    leaveChat: () => router.replace(APP_ROUTES.CHAT.href),
    hasSession,
    noMessages,
    loading,
  }
}
