'use client'

import { ChatSidebar } from '@/components/00_common/chat/chat-sidebar'
import ChatWindow from '@/components/00_common/chat/chat-window'
import Spinner from '@/components/00_common/spinner'
import { cn } from '@/components/shadcn/lib/utils'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { IChatRoom } from '@/lib/interfaces/chat-room'
import useFirebaseStore from '@/lib/stores/firebase-store'
import useLoadingStore from '@/lib/stores/loading-store'
import { Menu } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Chat({
  currentRoom,
  existingRooms,
}: {
  currentRoom: IChatRoom | null
  existingRooms: IChatRoom[]
}) {
  const router = useRouter()

  const [token, setToken] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)

  const { setLoading } = useLoadingStore()
  const { user, getToken } = useFirebaseStore()

  useEffect(() => {
    const loadToken = async () => {
      try {
        setLoading('Loading...')
        setToken(await getToken())
      } catch (error) {
        router.replace(APP_ROUTES.NOTFOUND.href)
      } finally {
        setLoading(null)
      }
    }
    user && loadToken()
  }, [user])

  if (!token) return null

  return (
    <div className='flex flex-1 rounded-lg border w-full'>
      <div className={cn('border-r py-2', sidebarOpen && 'w-1/4')}>
        {sidebarOpen ? (
          <ChatSidebar existingRooms={existingRooms} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        ) : (
          <div className='w-full border-b flex justify-end p-2'>
            <button className='transition-transform duration-200 hover:scale-110' onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu />
            </button>
          </div>
        )}
      </div>

      <div className={cn('flex', sidebarOpen ? 'w-3/4' : 'w-full')}>
        <ChatWindow room={currentRoom} token={token} />
      </div>
    </div>
  )
}
