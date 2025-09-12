'use client'

import { getRooms } from '@/api'
import useChatStore from '@/chat/stores/chat-store'
import { ChatRoom } from '@/chat/types/chat-room'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/shadcn/components/ui/avatar'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/shadcn/components/ui/sheet'
import { cn } from '@/components/shadcn/lib/utils'
import Spinner from '@/components/spinner'
import { MenuIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ChatRoomList() {
  const { setCurrentRoom } = useChatStore()
  const currentRoom = useChatStore((state) => state.currentRoom)
  const [open, setOpen] = useState<boolean>(false)
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

  return (
    <Sheet open={open} onOpenChange={() => setOpen(!open)}>
      <SheetTrigger asChild>
        <button className='transition-transform duration-200 hover:scale-110'>
          <MenuIcon />
        </button>
      </SheetTrigger>

      <SheetContent
        side='left'
        className={cn(
          'flex flex-1',
          '[state=closed]:duration-300 data-[state=open]:duration-300',
        )}
      >
        <SheetHeader>
          <SheetTitle />
        </SheetHeader>
        <div className={cn('h-full w-full overflow-y-auto rounded border')}>
          {loading ? (
            <div className='flex h-full items-center justify-center'>
              <Spinner />
            </div>
          ) : (
            <div className='flex flex-1 flex-col justify-start gap-2 p-2'>
              {rooms.map((room: ChatRoom, i) => (
                <button
                  className={cn(
                    'flex w-full flex-1 flex-row items-center gap-2 border border-transparent p-2 hover:bg-secondary',
                    currentRoom &&
                      currentRoom.alias === room.alias &&
                      'rounded bg-secondary',
                  )}
                  key={i}
                  onClick={() => {
                    setCurrentRoom(room)
                    setOpen(false)
                  }}
                  disabled={currentRoom && currentRoom.alias === room.alias}
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
                    <p
                      className={cn('pr-2 italic text-black/50 transition-all')}
                    >
                      Selling
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
