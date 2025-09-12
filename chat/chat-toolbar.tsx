import ChatRoomList from '@/chat/chat-room-list'
import { useChatContext } from '@/chat/providers/chat-provider'
import useChatStore from '@/chat/stores/chat-store'
import { useEffect, useState } from 'react'

export default function ChatToolbar() {
  const status = useChatStore((state) => state.status)
  const { msUntilIdle } = useChatContext()
  const [remaining, setRemaining] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(Math.ceil(msUntilIdle() / 1000))
    }, 1000)
    return () => clearInterval(id)
  }, [msUntilIdle])

  return (
    <div className='flex items-center justify-between space-x-2 rounded border p-1 px-3 text-sm italic text-black/80'>
      <span>
        <ChatRoomList />
      </span>

      <span>
        {remaining < 10 && remaining > 0 && (
          <span>{remaining}s until idle</span>
        )}
      </span>

      <span>
        <span>{status.toUpperCase()}</span>
      </span>
    </div>
  )
}
