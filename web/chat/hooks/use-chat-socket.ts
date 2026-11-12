import { flagMessageRead } from '@/chat/helpers/flag-message-read'
import { upsertChatRoom } from '@/chat/helpers/upsert-chat-room'
import { useIdleHandler } from '@/chat/hooks/use-idle-handler'
import { useLoadToken } from '@/chat/hooks/use-load-token'
import useChatStore from '@/chat/stores/chat-store'
import {
  ChatClientIn,
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
  const rooms = useChatStore((state) => state.rooms)

  const token = useLoadToken()
  useIdleHandler(token)

  useEffect(() => {
    if (open && token) {
      setUrl(token)
    } else {
      setUrl()
    }
  }, [open])

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
    onClose: () => {
      if (status !== 'idling') {
        setProps({ status: 'disconnected' })
      }
    },

    onMessage: async (e: MessageEvent<any>) => {
      try {
        const payload: ChatPayloadIn = JSON.parse(e.data)
        // console.log('received:', payload)

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
          case 'client':
            handleClientIn(payload)
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
    // console.log('sent:', payload)
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

    if (!messages.length && currentRoom) {
      const activeRoom = rooms.find((r) => r.alias === currentRoom.alias)
      if (activeRoom) {
        activeRoom.unread = false
      }
    }
  }

  const handleTextIn = (payload: ChatTextIn) => {
    setProps({ messages: [payload, ...messages] })
  }

  const handleReadIn = (payload: ChatReadIn) => {
    const lastRead = new Date(payload.lastRead)
    // read latest state; a new array is required for ChatWindow to re-render
    const current = useChatStore.getState().messages
    setProps({
      messages: current.map((m) => flagMessageRead(m, lastRead)),
      peerlastRead: payload.lastRead,
    })
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

  const handleClientIn = (payload: ChatClientIn) => {
    // server only sends this when we're not in that room, i.e. it's unread
    setProps({
      rooms: upsertChatRoom(useChatStore.getState().rooms, payload.room),
      hasUnread: true,
    })
  }

  return {
    sendTextOut: (message: string) => {
      if (currentRoom && currentRoom.item.isDeleted) return

      _sendMessage({ type: 'text', content: message })
    },
    sendRestoreOut: () => {
      if (since) {
        _sendMessage({ type: 'restore', since })
      }
    },
    sendTypingOut: (typing: boolean) => {
      if (currentRoom && currentRoom.item.isDeleted) return

      _sendMessage({ type: 'typing', typing })
    },
  }
}
