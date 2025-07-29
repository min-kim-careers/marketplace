'use client'

import { isActiveMode } from '@/chat/constants/active-modes'
import { ChatMode } from '@/chat/enums/chat-mode'
import {
  ChatMessageIn,
  ChatMessageInChat,
  ChatMessageInRestored,
} from '@/chat/types/chat-message-in'
import {
  ChatMessageOut,
  ChatMessageOutChat,
} from '@/chat/types/chat-message-out'
import { toPath } from '@/lib/helpers/to-path'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export interface ChatSocket {
  senders: {
    sendChat: (text: string) => void
    sendTyping: () => void
    sendNotTyping: () => void
    sendRestore: () => void
  }
  isChatting: () => boolean
  setRoomId: (roomId: string | null) => void
  setToken: (token: string | null) => void

  chatMessages: ChatMessageInChat[]
  noMessages: boolean
  isTyping: boolean
}

export function useChatSocket(): ChatSocket {
  const wsRef = useRef<WebSocket | null>(null)

  const [chatMessages, setChatMessages] = useState<ChatMessageInChat[]>([])
  const [mode, setMode] = useState<ChatMode>(ChatMode.NULL)
  const [roomId, setRoomId] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    if (roomId) {
      sendMessage({ mode: ChatMode.JOIN, roomSlug: roomId })
    } else {
      sendMessage({ mode: ChatMode.LEAVE })
    }
  }, [roomId])

  useEffect(() => {
    try {
      if (!token) return

      const wsPath = process.env.NEXT_PUBLIC_CHAT_WS || ''

      const url = toPath(wsPath, { token })
      console.log('Initializing websocket')
      const ws = new WebSocket(url)
      wsRef.current = ws

      ws.onopen = () => {}
      ws.onmessage = (event: MessageEvent<any>) => {
        const newMessage: ChatMessageIn = JSON.parse(event.data)
        console.log('Received message:', newMessage)
        switch (newMessage.mode) {
          case ChatMode.CHAT: {
            handleChatMessage(newMessage)
            break
          }
          case ChatMode.NO_MESSAGES: {
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
          case ChatMode.TYPING: {
            handleTypingMessage()
            break
          }
          case ChatMode.NOT_TYPING: {
            handleNotTypingMessage()
            break
          }
          default: {
            console.log('Invalid message:', event.data)
            break
          }
        }
        if (newMessage.mode !== ChatMode.CHAT) {
          setMode(newMessage.mode)
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

  const [isTyping, setIsTyping] = useState<boolean>(false)
  // ----------------------------- Message handlers -----------------------------

  const handleChatMessage = (message: ChatMessageInChat) => {
    setChatMessages((prev) => [message, ...prev])
  }

  const handleEmptyMessage = () => {
    setNoMessages(true)
  }

  const handleRestoredMessage = (message: ChatMessageInRestored) => {
    if (!message.messages.length) return setNoMessages(true)
    setChatMessages((prev) => [...prev, ...message.messages])
    toast(`Restored messages`)
  }

  const handleConnectedMessage = () => {
    if (roomId) {
      sendMessage({
        mode: ChatMode.JOIN,
        roomSlug: roomId,
      })
    }
  }

  const handleJoinedMessage = () =>
    sendMessage({
      mode: ChatMode.RESTORE,
    })

  const handleLeftMessage = () => {
    setChatMessages([])
  }

  const handleTypingMessage = () => {
    setIsTyping(true)
  }

  const handleNotTypingMessage = () => {
    setIsTyping(false)
  }

  // ----------------------------------------------------------------------------

  const sendMessage = (message: ChatMessageOut): ChatMessageOut => {
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify(message))
      console.log('Message sent:', message)
    }
    return message
  }

  const sendChat = (text: string) => {
    const newMessage = sendMessage({
      mode: ChatMode.CHAT,
      content: text,
    }) as ChatMessageOutChat

    setChatMessages((prev) => [
      {
        ...newMessage,
        tempId: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        isMine: true,
        sent: false,
        read: false,
      } as ChatMessageInChat,
      ...prev,
    ])
  }

  const sendTyping = () => sendMessage({ mode: ChatMode.TYPING })

  const sendNotTyping = () => sendMessage({ mode: ChatMode.NOT_TYPING })

  const sendRestore = () =>
    !noMessages &&
    sendMessage({
      mode: ChatMode.RESTORE,
    })

  const isChatting = () => (mode && isActiveMode(mode)) ?? false

  return {
    senders: {
      sendChat,
      sendTyping,
      sendNotTyping,
      sendRestore,
    },
    isChatting,
    setRoomId,
    setToken,

    chatMessages,
    noMessages,
    isTyping,
  }
}
