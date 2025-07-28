import { ChatRoom } from '@/chat/types/chat-room'
import { useChatPageStore } from '@/chat/providers/chat-page-provider'
import {
  AvatarFallback,
  AvatarImage,
} from '@/components/shadcn/components/ui/avatar'
import { cn } from '@/components/shadcn/lib/utils'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { useIsMobile } from '@/lib/hooks/ui/use-is-mobile'
import useLayoutStore from '@/lib/stores/layout-store'
import { Avatar } from '@radix-ui/react-avatar'
import { Menu } from 'lucide-react'
import Link from 'next/link'

export function ChatSidebar({ className }: { className?: string }) {
  const { currentRoom, existingRooms } = useChatPageStore()

  const { chatSidebarOpen: open, setChatSidebarOpen: setOpen } =
    useLayoutStore()

  const isMobile = useIsMobile()

  return (
    <div
      className={cn(
        'transition-all duration-300 ease-in-out',
        open ? (isMobile ? 'w-1/2' : 'w-1/3') : 'w-12',
        className,
      )}
    >
      <div
        className={cn(
          'flex w-full items-center border-b pb-2 pl-2 transition-all duration-300 ease-in-out',
        )}
      >
        <button
          className='transition-transform duration-200 hover:scale-110'
          onClick={() => setOpen(!open)}
        >
          <Menu size={24} />
        </button>
      </div>
      <div
        className={cn(
          'flex w-full flex-col gap-2 overflow-y-auto overflow-x-hidden p-2 transition-opacity duration-200 ease-in-out',
          open ? 'opacity-100' : 'opacity-0',
        )}
      >
        {existingRooms.map((room, i) => (
          <ChatLink
            key={i}
            isActive={room === currentRoom}
            open={open}
            room={room}
          />
        ))}
      </div>
    </div>
  )
}

function ChatLink({
  room,
  open,
  isActive,
}: {
  room: ChatRoom
  open: boolean
  isActive: boolean
}) {
  return (
    <div className='flex h-full flex-row items-center justify-between gap-2'>
      <Link
        href={`${APP_ROUTES.CHAT.href}/${room.id}`}
        className={cn('flex-[9]', (isActive || !open) && 'pointer-events-none')}
      >
        <button
          className={cn(
            'line-clamp-1 flex w-full flex-row items-center justify-between truncate rounded-xl border bg-gray-100 p-4 transition-colors duration-200 hover:bg-gray-300',
            isActive && 'bg-gray-400',
          )}
        >
          <div className='flex flex-row items-center gap-2 w-full'>
            <span className='mr-2'>
              <Avatar>
                <AvatarImage src={room.item.imageUrls[0]} />
                <AvatarFallback>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full'>
                    ?
                  </div>
                </AvatarFallback>
              </Avatar>
            </span>
            <span className='flex flex-col items-start justify-center'>
              <p className='font-semibold'>{room.item.profileHandle}</p>
              <p>{room.item.name}</p>
            </span>
            {isActive && <span className='flex w-full items-center justify-end pr-2 italic text-gray-100'>Joined</span>}
          </div>
        </button>
      </Link>
    </div>
  )
}
