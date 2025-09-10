import { useChatContext } from '@/chat/providers/chat-provider'
import useChatStore from '@/chat/stores/chat-store'
import { useEffect, useState } from 'react'

export default function ChatToolbar() {
  const status = useChatStore((state) => state.status)
  const { timeUntilIdle } = useChatContext()
  const [remaining, setRemaining] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(Math.ceil(timeUntilIdle() / 1000))
    }, 1000)
    return () => clearInterval(id)
  }, [timeUntilIdle])

  return (
    <div className='flex justify-between space-x-2 rounded border p-2 text-sm italic text-black/80'>
      <span>
        <span>{status.toUpperCase()}</span>
      </span>

      {remaining < 10 && remaining > 0 && <span>{remaining}s until idle</span>}
    </div>
  )
}
