import { useChatService } from '@/lib/hooks/use-chat-service'
import { IChatSession } from '@/lib/interfaces/chat-session'
import useLoadingStore from '@/lib/stores/loading-store'
import { useEffect } from 'react'

export default function ChatSession({
  token,
  session,
}: {
  token: string
  session: IChatSession
}) {
  const { messages, sendMessage, noMessages, loading } =
    useChatService({
      token,
      session,
    })
  const { setLoading } = useLoadingStore()

  useEffect(() => {
    loading ? setLoading('Initializing chat...', true) : setLoading(null)
  }, [loading])

  return <div></div>
}
