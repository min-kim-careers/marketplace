import { getUnreadMessagesCount } from '@/api/service/chat'
import Spinner from '@/components/spinner'
import { useAuthContext } from '@/lib/providers/auth-provider'
import { useEffect, useState } from 'react'

const useGetUnreadCount = () => {
  const [count, setCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const { isAuthenticated } = useAuthContext()

  useEffect(() => {
    const getUnreadCount = async () => {
      try {
        setLoading(true)
        if (isAuthenticated) setCount(await getUnreadMessagesCount())
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    getUnreadCount()
  }, [isAuthenticated])

  return { loading, count }
}

export default function UnreadCountBadge() {
  const { loading, count } = useGetUnreadCount()

  if (loading)
    return (
      <span className='absolute -right-4 -top-3 rounded-full px-1 text-xs font-bold text-blue-100'>
        <Spinner className='scale-[0.4] transform' />
      </span>
    )

  if (count === 0) return null

  return (
    <span className='absolute -right-1 -top-1 rounded-full bg-red-500 px-1 text-xs font-bold text-blue-100'>
      {count > 99 ? '99+' : count.toString()}
    </span>
  )
}
