import { useChatContext } from '@/lib/providers/chat-provider'
import { useEffect, useState } from 'react'

export default function Chat() {
  const { socket } = useChatContext()
  const [messages, setMessages] = useState<any[]>([])

  useEffect(() => {
    if (!socket) return

    socket?.addEventListener('message', (e) => {
      setMessages((prev) => [...prev, JSON.parse(e.data)])
    })
  })

  return <div>{messages.map((m, i) => <p key={i}>{m.body}</p>)}</div>;
}
