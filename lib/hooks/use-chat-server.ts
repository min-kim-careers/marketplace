'use client'

import { ChatMessageType } from '@/lib/enums/chat-message-type'
import { auth } from '@/lib/firebase/config'
import { IChatMessage } from '@/lib/interfaces/chat-message'
import { IChatSession } from '@/lib/interfaces/chat-session'
import { onAuthStateChanged } from 'firebase/auth'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export function useChatSession({
  session,
}: {
  session: IChatSession
}) {
  const wsRef = useRef<WebSocket | null>(null)

  const [messages, setMessages] = useState<IChatMessage[]>(
    [],
  )
  const [noMessages, setNoMessages] =
    useState<boolean>(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (!user) return

        const token = await user.getIdToken()
        const url = `${process.env.NEXT_PUBLIC_CHAT_WS}?${new URLSearchParams({ token })}`

        console.log(url)

        const ws = new WebSocket(url)
        wsRef.current = ws
        console.log('Initializing websocket')

        ws.onopen = () => {
          console.log(`Connected to ${url}`)
          sendMessage({
            ...session,
            messageType: ChatMessageType.CONNECT,
          })
        }

        ws.onmessage = (event) => {
          const newMessage: IChatMessage = JSON.parse(
            event.data,
          )
          console.log('Received message:', newMessage)

          switch (newMessage.messageType) {
            case ChatMessageType.CHAT: {
              setMessages((prev) => [newMessage, ...prev])
              break
            }

            case ChatMessageType.RESTORE: {
              if (!!!newMessage.messageContent) {
                break
              }

              const restoredMessages: IChatMessage[] =
                newMessage.messageContent

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

        ws.onclose = (event) => {
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

        return () => {
          wsRef.current?.close()
          unsubscribe()
        }
      },
    )
  }, [])

  const sendMessage = (msg: IChatMessage) => {
    wsRef.current?.send(JSON.stringify(msg))

    switch (msg.messageType) {
      case ChatMessageType.CHAT: {
        setMessages((prev) => [msg, ...prev])
        break
      }

      default: {
        break
      }
    }
    console.log('Message sent:', msg)
  }

  return { messages, sendMessage, noMessages }
}
