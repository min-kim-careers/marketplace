import { flagMessageRead } from '@/chat/helpers/flag-message-read'
import { useLoadToken } from '@/chat/hooks/use-load-token'
import useChatStore from '@/chat/stores/chat-store'
import {
  ChatConnectedIn,
  ChatErrorIn,
  ChatJoinedIn,
  ChatPayloadIn,
  ChatReadIn,
  ChatRestoreIn,
  ChatTextIn,
} from '@/chat/types/chat-inbound'
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
  const { setUrl, setProps } = useChatStore()

  const messages = useChatStore((state) => state.messages)
  const since = useChatStore((state) => state.since)
  const open = useChatStore((state) => state.open)
  const url = useChatStore((state) => state.url)
  const currentRoom = useChatStore((state) => state.currentRoom)
  const status = useChatStore((state) => state.status)

  const token = useLoadToken()

  useEffect(() => {
    if (open && token) {
      setUrl(token)
    } else {
      setUrl()
    }
  }, [open, token])

  const joinRoom = () => {
    if (currentRoom) {
      setProps({
        status: 'joining',
        messages: [],
        noMessages: false,
        since: undefined,
      })
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
      setProps({ status: 'idling' })
    },
    onActive: () => {
      console.log('unidling')

      setUrl(token)
    },
    debounce: 500,
  })

  const { sendJsonMessage } = useWebSocket(url ?? null, {
    onOpen: () => {
      setProps({ status: 'connecting' })
    },

    onMessage: async (e: MessageEvent<any>) => {
      try {
        const payload: ChatPayloadIn = JSON.parse(e.data)
        console.log('received:', payload)

        switch (payload.type) {
          case 'connected':
            handleConnectedIn(payload)
            break
          case 'joined':
            handleJoinedIn(payload)
            break
          case 'restored':
            handleRestoredIn(payload)
            break
          case 'text':
            handleTextIn(payload)
            break
          case 'read':
            handleReadIn(payload)
            break
          case 'error':
            handleErrorIn(payload)
          default:
            break
        }
      } catch (error) {
        console.error('error handling message')
      }
    },
  })

  const handleConnectedIn = (_: ChatConnectedIn) => {
    setProps({ status: 'connected' })
    if (currentRoom) {
      joinRoom()
    }
  }

  const handleJoinedIn = (_: ChatJoinedIn) => {
    const since = new Date().toISOString()
    setProps({ since, status: 'joined' })
    sendMessage({ type: 'restore', since })
  }

  const handleRestoredIn = async (payload: ChatRestoreIn) => {
    const { previous } = payload
    if (!previous.length) {
      setProps({ noMessages: true })
      return
    }
    setProps({
      messages: [...messages, ...previous],
      since: previous[previous.length - 1].timestamp,
    })
  }

  const handleTextIn = (payload: ChatTextIn) => {
    setProps({ messages: [payload, ...messages] })
  }

  const handleReadIn = (payload: ChatReadIn) => {
    messages.forEach((m) => flagMessageRead(m, new Date(payload.lastRead)))
  }

  const handleErrorIn = (payload: ChatErrorIn) => {
    if (payload.message) {
      console.error('server error:', payload.message)
    } else {
      console.error('server error')
    }
    setProps({ status: 'error' })
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
    msUntilIdle: getRemainingTime,
  }
}
