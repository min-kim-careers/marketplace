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
import { formatCurrency } from '@/lib/helpers/format-price'
import { ArrowLeft, MenuIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ChatRoomList() {
  const { setProps, hasUnread, currentRoom, rooms } = useChatStore()

  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const loadRooms = async () => {
      try {
        setLoading(true)
        const rooms = await getRooms({
          page: 1,
        })
        setProps({ rooms })
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    if (open && !rooms.length) {
      loadRooms()
    }
  }, [open])

  return (
    <Sheet open={open} onOpenChange={() => setOpen(!open)}>
      <SheetTrigger asChild>
        <button className='relative transition-transform duration-200 hover:scale-110'>
          <MenuIcon />
          <div
            className={cn(
              'absolute -right-1 -top-1 h-0 w-0 rounded-full bg-red-500 transition-all',
              hasUnread && 'h-3 w-3',
            )}
          />
        </button>
      </SheetTrigger>

      <SheetContent
        side='right'
        className={cn(
          'flex flex-1 flex-col gap-2',
          '[state=closed]:duration-300 data-[state=open]:duration-300',
        )}
      >
        <SheetHeader>
          <SheetTitle />
        </SheetHeader>
        <div className='relative flex flex-row items-center justify-center rounded border p-2 text-base font-normal'>
          <span className='flex flex-[1] items-center'>
            <ArrowLeft
              onClick={() => setOpen(false)}
              className='absolute left-0 ml-2 cursor-pointer transition-all hover:scale-105 active:scale-95'
            />
          </span>
          <span className='flex flex-[10] items-center justify-center'>
            Rooms
          </span>
          <span className='flex flex-[1] items-center'></span>
        </div>
        <div className={cn('h-full w-full overflow-y-auto rounded border')}>
          {loading ? (
            <div className='flex h-full items-center justify-center'>
              <Spinner />
            </div>
          ) : (
            <div className='flex h-full flex-1 flex-col justify-start gap-2 p-2'>
              {rooms.length ? (
                rooms.map((room: ChatRoom, i) => (
                  <button
                    className={cn(
                      'relative flex w-full flex-row items-center gap-4 border border-transparent p-2 hover:bg-secondary',
                      currentRoom &&
                        currentRoom.alias === room.alias &&
                        'rounded bg-secondary',
                    )}
                    key={i}
                    onClick={() => {
                      setProps({ currentRoom: room })
                      setOpen(false)
                    }}
                    disabled={currentRoom && currentRoom.alias === room.alias}
                  >
                    <Avatar className='h-9 w-9'>
                      <AvatarImage src={room.item.previewUrl} />
                      <AvatarFallback>
                        <p className='text-lg font-bold'>-</p>
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col'>
                      <span className='text-left'>{room.peer.handle}</span>
                      <span className='text-left'>
                        {formatCurrency(room.item.price)} - {room.item.name}
                      </span>
                    </div>
                    {room.isSeller && (
                      <p
                        className={cn(
                          'flex-1 pr-2 text-right italic text-black/50 transition-all',
                        )}
                      >
                        Selling
                      </p>
                    )}
                    {room.unread && (
                      <div
                        className={cn(
                          'absolute -left-1 -top-1 h-3 w-3 rounded-full bg-red-500 transition-all',
                        )}
                      />
                    )}
                  </button>
                ))
              ) : (
                <div className='flex h-full items-center justify-center italic text-muted-foreground'>
                  No rooms...
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
