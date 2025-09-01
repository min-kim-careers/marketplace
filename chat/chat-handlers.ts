import { WebSocketHook } from 'react-use-websocket/dist/lib/types'

export const useChatHandler = (ws: WebSocketHook) => {
  const {
    getWebSocket,
    lastJsonMessage,
    lastMessage,
    readyState,
    sendJsonMessage,
  } = ws

  const handleJoin = async () => {}

  return { handleJoin }
}
