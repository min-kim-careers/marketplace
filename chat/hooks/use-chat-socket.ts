import { flagMessageRead } from '@/chat/helpers/flag-message-read'
import { useIdleHandler } from '@/chat/hooks/use-idle-handler'
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
  ChatTypingIn,
} from '@/chat/types/chat-inbound'
import { ChatPayloadOut } from '@/chat/types/chat-outbound'
import { useEffect } from 'react'
import useWebSocket from 'react-use-websocket'

export type ChatSocketState = {
  sendTextOut: (message: string) => void
  sendRestoreOut: () => void
  sendTypingOut: (typing: boolean) => void
}

export const useChatSocket = (): ChatSocketState => {
  const { setUrl, setProps, clearState } = useChatStore()

  const open = useChatStore((state) => state.open)
  const messages = useChatStore((state) => state.messages)
  const since = useChatStore((state) => state.since)
  const url = useChatStore((state) => state.url)
  const currentRoom = useChatStore((state) => state.currentRoom)
  const status = useChatStore((state) => state.status)
  const lastRead = useChatStore((state) => state.peerlastRead)

  const token = useLoadToken()
  useIdleHandler(token)

  useEffect(() => {
    if (open && token) {
      setUrl(token)
    } else {
      setUrl()
    }
  }, [open, token])

  const joinRoom = () => {
    if (currentRoom) {
      clearState()
      _sendMessage({ type: 'join', roomAlias: currentRoom.alias })
    }
  }

  useEffect(() => {
    if (status === 'connected' || status === 'joined') joinRoom()
  }, [currentRoom])

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
          case 'typing':
            handleTypingIn(payload)
            break
          case 'error':
            handleErrorIn(payload)
            break
          default:
            break
        }
      } catch (error) {
        console.error('error handling message')
      }
    },
  })

  const _sendMessage = (payload: ChatPayloadOut) => {
    sendJsonMessage(payload)
    console.log('sent:', payload)
  }

  const handleConnectedIn = (_: ChatConnectedIn) => {
    setProps({ status: 'connected' })
    if (currentRoom) {
      joinRoom()
    }
  }

  const handleJoinedIn = (_: ChatJoinedIn) => {
    const since = new Date().toISOString()
    setProps({ since, status: 'joined' })
    _sendMessage({ type: 'restore', since })
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
    for (const msg of messages) {
      if (msg.timestamp <= lastRead) break
      flagMessageRead(msg, new Date(payload.lastRead))
    }
    setProps({ peerlastRead: payload.lastRead })
  }

  const handleTypingIn = (payload: ChatTypingIn) => {
    setProps({ peerTyping: payload.typing })
  }

  const handleErrorIn = (payload: ChatErrorIn) => {
    if (payload.message) {
      console.error('server error:', payload.message)
    } else {
      console.error('server error')
    }
    setProps({ status: 'error' })
  }

  return {
    sendTextOut: (message: string) => {
      _sendMessage({ type: 'text', content: message })
    },
    sendRestoreOut: () => {
      if (since) {
        _sendMessage({ type: 'restore', since })
      }
    },
    sendTypingOut: (typing: boolean) => {
      _sendMessage({ type: 'typing', typing })
    },
  }
}
