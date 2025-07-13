let socket: WebSocket | null = null

export function getSocket(url: string): WebSocket {
  if (!socket || socket.readyState === WebSocket.CLOSED) {
    socket = new WebSocket(url)
  }
  return socket
}
