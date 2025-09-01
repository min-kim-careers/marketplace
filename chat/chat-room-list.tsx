'use client'

import { getRooms } from '@/api'
import { ChatRoom } from '@/chat/chat-room'
import useChatStore from '@/chat/chat-store'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/shadcn/components/ui/avatar'
import { cn } from '@/components/shadcn/lib/utils'
import { useEffect, useState } from 'react'

export default function ChatRoomList() {
  const { currentRoom, setCurrentRoom } = useChatStore()
  const [rooms, setRooms] = useState<ChatRoom[]>([])

  useEffect(() => {
    const loadRooms = async () => {
      setRooms(await getRooms({ page: 1 }))
    }
    loadRooms()
  }, [])

  const handleClick = (room: ChatRoom) => {
    setCurrentRoom(room)
  }

  return (
    <div
      className={cn(
        'group flex w-14 flex-col gap-2 overflow-hidden rounded border p-2 transition-all hover:w-48',
      )}
    >
      {rooms.map((room: ChatRoom, i) => (
        <button
          className={cn(
            'flex w-full flex-row items-center gap-2 transition-[width] group-hover:w-full',
            currentRoom === room && 'rounded border border-black bg-secondary',
          )}
          key={i}
          onClick={() => handleClick(room)}
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
              'truncate text-nowrap opacity-0 transition-[width] group-hover:opacity-100',
            )}
          >
            {room.item.name}
          </span>
        </button>
      ))}
    </div>
  )
}
