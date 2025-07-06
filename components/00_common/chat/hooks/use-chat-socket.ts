'use client'

import { ChatMessageMode } from '@/lib/enums/chat-message-type'
import { useLoadToken } from '@/lib/firebase/use-load-token'
import { IChatMessage } from '@/lib/interfaces/chat-message'
import { IChatMessageChat } from '@/lib/interfaces/chat-message-chat'
import { IChatMessageRestore } from '@/lib/interfaces/chat-message-restore'
import { IChatRoom } from '@/lib/interfaces/chat-room'
import { useChatPageStore } from '@/lib/providers/chat-page-provider'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export function useChatSocket() {
  const token = useLoadToken()
  const room = useChatPageStore(store => store.currentRoom)

  const wsRef = useRef<WebSocket | null>(null)

  const [messages, setMessages] = useState<IChatMessageChat[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (room) sendMessage({ mode: ChatMessageMode.JOIN, roomId: room.id })
  }, [room])

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
            handleRestoredMessage(data as IChatMessageRestore)
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

  const handleChatMessage = (message: IChatMessageChat) => {
    setMessages((prev) => [message, ...prev])
  }

  const handleRestoredMessage = (message: IChatMessageRestore) => {
    if (!message.messages.length) return setNoMessages(true)
    setMessages((prev) => [...prev, ...message.messages])
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

  const sendMessage = (message: any) => {
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
