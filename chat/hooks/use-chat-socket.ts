import { useLoadToken } from '@/chat/hooks/use-load-token'
import useChatStore from '@/chat/stores/chat-store'
import { ChatPayloadIn, ChatTextIn } from '@/chat/types/chat-inbound'
import { ChatPayloadOut } from '@/chat/types/chat-outbound'
import { toPath } from '@/lib/helpers/to-path'
import { useEffect } from 'react'
import { useIdleTimer } from 'react-idle-timer'
import useWebSocket from 'react-use-websocket'

export type ChatSocketState = {
  sendTextOut: (message: string) => void
  sendRestoreOut: () => void
  timeUntilIdle: () => number
}

const buildUrl = (token: string) =>
  toPath('ws://192.168.8.103/chat/ws', {
    token,
  })

export const useChatSocket = (): ChatSocketState => {
  const {
    url,
    currentRoom,
    setUrl,
    setMessages,
    setNoMessages,
    setSince,
    setStatus,
  } = useChatStore()

  const messages = useChatStore((state) => state.messages)
  const since = useChatStore((state) => state.since)
  const noMessages = useChatStore((state) => state.noMessages)
  const status = useChatStore((state) => state.status)

  const token = useLoadToken()

  useEffect(() => {
    if (token) {
      setUrl(buildUrl(token))
    }
  }, [token])

  const joinRoom = () => {
    if (currentRoom) {
      sendOut({ type: 'join', roomAlias: currentRoom.alias })
      setStatus('joining')
    }
  }

  useEffect(() => joinRoom(), [currentRoom])

  const { getRemainingTime } = useIdleTimer({
    timeout: 5000,
    onIdle: () => {
      setUrl()
      setStatus('idle')
    },
    onActive: () => {
      setMessages([])
      setNoMessages(false)
      if (token) setUrl(buildUrl(token))
      joinRoom()
    },
    debounce: 500,
  })

  const socket = useWebSocket(url ?? null, {
    onOpen: () => {
      setStatus('connecting')
    },
    onMessage: async (e: MessageEvent<any>) => {
      try {
        const payload: ChatPayloadIn = JSON.parse(e.data)
        console.log('received:', payload)

        switch (payload.type) {
          case 'connected':
            handleConnectedIn()
            break
          case 'joined':
            handleJoinIn()
            break
          case 'restore':
            handleRestoreIn(payload.previous)
            break
          case 'text':
            handleTextIn(payload)
            break
          default:
            break
        }
      } catch (error) {
        console.error('error handling message')
      }
    },
  })

  // --------------------------------- IN ---------------------------------
  const handleConnectedIn = () => {
    setStatus('connected')
  }

  const handleJoinIn = () => {
    const since = new Date().toISOString()
    setSince(since)
    sendOut({ type: 'restore', since })
    setStatus('joined')
  }

  const handleRestoreIn = (previous: ChatTextIn[]) => {
    if (previous.length && !noMessages) {
      setMessages([...messages, ...previous])
      const since = previous[previous.length - 1].timestamp
      setSince(since)
    } else {
      setNoMessages(true)
    }
  }

  const handleTextIn = (msg: ChatTextIn) => {
    setMessages([msg, ...messages])
  }

  // --------------------------------- OUT ---------------------------------
  const sendOut = (payload: ChatPayloadOut) => {
    socket.sendJsonMessage(payload)
    console.log('sent:', payload)
  }

  const sendTextOut = (message: string) => {
    sendOut({ type: 'text', content: message })
  }

  const sendRestoreOut = () => {
    if (since) {
      sendOut({ type: 'restore', since })
    }
  }

  const timeUntilIdle = () => getRemainingTime()

  return {
    sendTextOut,
    sendRestoreOut,
    timeUntilIdle,
  }
}
