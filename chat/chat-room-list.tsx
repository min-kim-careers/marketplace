'use client'

import { getRooms } from '@/api'
import useChatStore from '@/chat/chat-store'
import { ChatRoom } from '@/chat/types/chat-room'
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
  const [open, setOpen] = useState<boolean>(false)

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
        'flex cursor-pointer flex-col gap-2 overflow-hidden rounded border p-2 transition-all duration-300',
        open ? 'w-[50vw] sm:w-[100vw]' : 'w-[4.5rem]',
      )}
      onClick={() => setOpen((o) => !o)}
    >
      {rooms.map((room: ChatRoom, i) => (
        <button
          className={cn(
            'flex w-full flex-row items-center gap-2 p-2 transition-[width]',
            currentRoom === room && 'rounded border border-black bg-secondary',
            currentRoom !== room &&
              open &&
              'w-full rounded-lg transition-all duration-200 hover:bg-black/10',
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
              'flex w-full justify-between truncate text-nowrap transition-all',
              open ? 'opacity-100' : 'opacity-0',
            )}
          >
            {room.item.name}
          </span>

          {room.isSeller && (
            <p
              className={cn(
                'pr-2 italic text-black/50 transition-all',
                open ? 'opacity-100' : 'opacity-0',
              )}
            >
              Selling
            </p>
          )}
        </button>
      ))}
    </div>
  )
}
