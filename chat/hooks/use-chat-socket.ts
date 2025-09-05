import useChatStore from '@/chat/stores/chat-store'
import { ChatMessageIn, ChatPayloadIn } from '@/chat/types/chat-inbound'
import { ChatPayloadOut } from '@/chat/types/chat-outbound'
import { useEffect } from 'react'
import useWebSocket from 'react-use-websocket'

export type ChatSocketState = {
  sendTextMessage: (message: string) => void
}

export const useChatSocket = (): ChatSocketState => {
  const {
    url,
    setUrl,
    currentRoom,
    setJoinedRoom,
    joinedRoom,
    addMessage,
    setMessages,
  } = useChatStore()

  useEffect(() => {
    if (currentRoom) {
      sendMessage({ type: 'join', roomAlias: currentRoom.alias })
    }
  }, [currentRoom])

  const socket = useWebSocket(url, {
    onMessage: async (e: MessageEvent<any>) => {
      try {
        const payload: ChatPayloadIn = JSON.parse(e.data)
        console.log('received:', payload)

        switch (payload.type) {
          case 'join':
            handleJoin(payload.history)
            break
          case 'text':
            handleTextMessage({ ...payload })
            break
          default:
            break
        }
      } catch (error) {
        console.error('error handling message')
      }
    },
  })

  const sendMessage = (payload: ChatPayloadOut) => {
    socket.sendJsonMessage(payload)
    console.log('sent:', payload)
  }

  const handleJoin = (history: ChatMessageIn[]) => {
    setJoinedRoom(true)
    setMessages(history)
  }

  const handleTextMessage = (msg: ChatMessageIn) => {
    addMessage(msg)
  }

  const sendTextMessage = (message: string) => {
    sendMessage({ type: 'text', content: message })
  }

  return { sendTextMessage }
}
