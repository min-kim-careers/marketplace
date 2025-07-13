'use client'

import { isActiveMode } from '@/chat/constants/active-modes'
import { ChatMode } from '@/chat/enums/chat-mode'
import { ChatSocket } from '@/chat/interfaces/chat-socket'
import { ChatMessage, ChatModeMessage } from '@/chat/types/chat-message'
import { useLoadToken } from '@/lib/firebase/use-load-token'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export function useChatSocket(): ChatSocket {
  const token = useLoadToken()

  const wsRef = useRef<WebSocket | null>(null)
  const messagesRef = useRef<ChatModeMessage[]>([])

  const [messages, setMessages] = useState<ChatModeMessage[]>([])
  const [mode, setMode] = useState<ChatMode>(ChatMode.INITIALIZING)
  const [roomId, setRoomId] = useState<string | null>(null)

  useEffect(() => {
    if (messages.length) {
      messagesRef.current = messages
    }
  }, [messages])

  useEffect(() => {
    if (roomId) {
      sendMessage({ mode: ChatMode.JOIN, roomSlug: roomId })
    } else {
      sendMessage({ mode: ChatMode.LEAVE })
    }
  }, [roomId])

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

  const handleChatMessage = (message: ChatModeMessage) => {
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
    if (roomId) {
      sendMessage({
        mode: ChatMode.JOIN,
        roomSlug: roomId,
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

  const handleTypingMessage = () => {
    setIsTyping(true)
  }

  const handleNotTypingMessage = () => {
    setIsTyping(false)
  }

  // ----------------------------------------------------------------------------

  const sendMessage = (message: ChatMessage): ChatMessage => {
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify(message))
      console.log('Message sent:', message)
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
      }) as ChatModeMessage,
      ...prev,
    ])

  const sendTyping = () => {
    sendMessage({ mode: ChatMode.TYPING })
  }

  const sendNotTyping = () => {
    sendMessage({ mode: ChatMode.NOT_TYPING })
  }

  const sendRestore = () => {
    console.log(messagesRef.current[messagesRef.current.length-1]);
    
    sendMessage({
      mode: ChatMode.RESTORE,
      createdAt: messagesRef.current[messagesRef.current.length-1].createdAt,
    })
  }

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

    messages,
    noMessages,
    isTyping,
  }
}
