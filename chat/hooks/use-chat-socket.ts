import { useLoadToken } from '@/chat/hooks/use-load-token'
import useChatStore from '@/chat/stores/chat-store'
import { ChatPayloadIn, ChatTextIn } from '@/chat/types/chat-inbound'
import { ChatPayloadOut } from '@/chat/types/chat-outbound'
import { useEffect } from 'react'
import { useIdleTimer } from 'react-idle-timer'
import useWebSocket from 'react-use-websocket'

export type ChatSocketState = {
  sendTextOut: (message: string) => void
  sendRestoreOut: () => void
  msUntilIdle: () => number
}

export const useChatSocket = (): ChatSocketState => {
  const { setUrl, setMessages, setNoMessages, setSince, setStatus } =
    useChatStore()

  const messages = useChatStore((state) => state.messages)
  const since = useChatStore((state) => state.since)
  const open = useChatStore((state) => state.open)
  const url = useChatStore((state) => state.url)
  const currentRoom = useChatStore((state) => state.currentRoom)
  const status = useChatStore((state) => state.status)

  const token = useLoadToken()

  useEffect(() => {
    if (open) {
      setUrl(token)
      start()
    } else {
      setUrl()
      pause() && reset()
    }
  }, [open])

  const joinRoom = () => {
    if (currentRoom) {
      setStatus('joining')
      setMessages([])
      setNoMessages(false)
      setSince()
      sendMessage({ type: 'join', roomAlias: currentRoom.alias })
    }
  }

  useEffect(() => {
    if (status === 'connected' || status === 'joined') joinRoom()
  }, [currentRoom])

  const { getRemainingTime, start, reset, pause } = useIdleTimer({
    timeout: 1000 * 60 * 5,
    // timeout: 3000,
    startManually: true,
    onIdle: () => {
      console.log('idling')

      setUrl()
      setStatus('idling')
    },
    onActive: () => {
      console.log('unidling')

      setUrl(token)
    },
    debounce: 500,
  })

  const { sendJsonMessage } = useWebSocket(url ?? null, {
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
            handleJoinedIn()
            break
          case 'restore':
            handleRestoreIn(payload.previous)
            break
          case 'text':
            handleTextIn(payload)
            break
          case 'error':
            handleErrorIn(payload.message)
          default:
            break
        }
      } catch (error) {
        console.error('error handling message')
      }
    },
  })

  const handleConnectedIn = () => {
    setStatus('connected')
    if (currentRoom) {
      joinRoom()
    }
  }

  const handleJoinedIn = () => {
    const since = new Date().toISOString()
    setSince(since)
    sendMessage({ type: 'restore', since })

    setStatus('joined')
  }

  const handleRestoreIn = async (previous: ChatTextIn[]) => {
    if (!previous.length) {
      setNoMessages(true)
      return
    }
    setMessages([...messages, ...previous])
    setSince(previous[previous.length - 1].timestamp)
  }

  const handleTextIn = (msg: ChatTextIn) => {
    setMessages([msg, ...messages])
  }

  const handleErrorIn = (errorMessage?: string) => {
    if (errorMessage) {
      console.error('server error:', errorMessage)
    } else {
      console.error('server error')
    }
  }

  const sendMessage = (payload: ChatPayloadOut) => {
    sendJsonMessage(payload)
    console.log('sent:', payload)
  }

  return {
    sendTextOut: (message: string) => {
      sendMessage({ type: 'text', content: message })
    },
    sendRestoreOut: () => {
      if (since) {
        sendMessage({ type: 'restore', since })
      }
    },
    msUntilIdle: () => getRemainingTime(),
  }
}
