'use client'

import { getRooms } from '@/api'
import useChatStore from '@/chat/stores/chat-store'
import { ChatRoom } from '@/chat/types/chat-room'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/shadcn/components/ui/avatar'
import { cn } from '@/components/shadcn/lib/utils'
import Spinner from '@/components/spinner'
import { useEffect, useState } from 'react'

export default function ChatRoomList() {
  const { currentRoom, setCurrentRoom } = useChatStore()
  const [rooms, setRooms] = useState<ChatRoom[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const loadRooms = async () => {
      try {
        setLoading(true)
        setRooms(await getRooms({ page: 1 }))
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    loadRooms()
  }, [])

  if (loading)
    return (
      <div className='flex h-full items-center justify-center rounded border'>
        <Spinner />
      </div>
    )

  return (
    <div className='h-full overflow-y-auto rounded border'>
      <div className='flex flex-1 flex-col justify-start gap-2 p-2'>
        {rooms.map((room: ChatRoom, i) => (
          <button
            className={cn(
              'flex w-full flex-1 flex-row items-center gap-2 border border-transparent p-2 hover:bg-secondary',
              currentRoom === room && 'rounded bg-secondary',
            )}
            key={i}
            onClick={() => setCurrentRoom(room)}
            disabled={currentRoom === room}
          >
            <Avatar className='h-9 w-9'>
              <AvatarImage src={room.item.profile.avatarUrl} />
              <AvatarFallback>
                <p className='text-lg font-bold'>
                  {room.item.profile.handle.charAt(0).toUpperCase()}
                </p>
              </AvatarFallback>
            </Avatar>
            <span
              className={cn(
                'flex w-full justify-between truncate text-nowrap transition-all',
              )}
            >
              {room.item.name}
            </span>
            {room.isSeller && (
              <p className={cn('pr-2 italic text-black/50 transition-all')}>
                Selling
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
