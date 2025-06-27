import { useChatSession } from '@/lib/hooks/use-chat-server'
import { IChatSession } from '@/lib/interfaces/chat-session'

export default function ChatSession({
  session,
}: {
  session: IChatSession
}) {
  const { messages, sendMessage, noMessages } =
    useChatSession({ session })

  return <div></div>
}
