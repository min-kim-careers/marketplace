import useChatStore from '@/chat/stores/chat-store'
import { ChatPayloadIn, ChatTextIn } from '@/chat/types/chat-inbound'
import { ChatPayloadOut } from '@/chat/types/chat-outbound'
import { useEffect } from 'react'
import useWebSocket from 'react-use-websocket'

export type ChatSocketState = {
  sendTextMessage: (message: string) => void
  sendRestoreMessage: () => void
}

export const useChatSocket = (): ChatSocketState => {
  const {
    url,
    setUrl,
    currentRoom,
    setJoinedRoom,
    joinedRoom,
    setMessages,
    setNoMessages,
    setSessionId,
  } = useChatStore()
  const messages = useChatStore((state) => state.messages)

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
          case 'connected':
            handleConnected(payload.sessionId)
            break
          case 'joined':
            handleJoin()
            break
          case 'restore':
            handleRestore(payload.previous)
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

  const handleConnected = (sessionId: string) => {
    setSessionId(sessionId)
  }

  const handleJoin = () => {
    setJoinedRoom(true)
  }

  const handleRestore = (previous: ChatTextIn[]) => {
    if (previous.length) {
      setMessages([...messages, ...previous])
    } else {
      setNoMessages(true)
    }
  }

  const handleTextMessage = (msg: ChatTextIn) => {
    setMessages([...messages, msg])
  }

  return {
    sendTextMessage: (message: string) => {
      sendMessage({ type: 'text', content: message })
    },
    sendRestoreMessage: () => {
      sendMessage({ type: 'restore' })
    },
  }
}
