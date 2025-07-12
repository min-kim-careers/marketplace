import { ChatRoom } from '@/chat/interfaces/chat-room'
import { useChatPageStore } from '@/chat/providers/chat-page-provider'
import { cn } from '@/components/shadcn/lib/utils'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { useIsMobile } from '@/lib/hooks/use-is-mobile'
import useLayoutStore from '@/lib/stores/layout-store'
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
          'flex w-full flex-col gap-2 overflow-y-auto p-2 transition-opacity duration-200 ease-in-out',
          open ? 'opacity-100' : 'opacity-0',
        )}
      >
        {existingRooms.map((room, i) => (
          <ChatLink key={i} currentRoom={currentRoom} open={open} room={room} />
        ))}
      </div>
    </div>
  )
}

function ChatLink({
  room,
  currentRoom,
  open,
}: {
  room: ChatRoom
  currentRoom: ChatRoom | null
  open: boolean
}) {
  return (
    <div className='flex flex-row items-center justify-between h-full gap-2'>
      <Link
        href={`${APP_ROUTES.CHAT.href}/${room.id}`}
        className={cn(
          'flex-[9]',
          ((currentRoom && currentRoom.id === room.id) || !open) &&
            'pointer-events-none',
        )}
      >
        <button
          className={cn(
            'line-clamp-1 flex w-full flex-row items-center justify-between truncate rounded-xl border bg-gray-100 p-2 transition-colors duration-200 hover:bg-gray-300',
            currentRoom &&
              currentRoom.id === room.id &&
              'bg-gray-400',
          )}
        >
          <div className='flex flex-col items-start gap-1'>
            <p>{room.item.profileHandle}</p>
            <p>{room.item.name}</p>
          </div>
        </button>
      </Link>
    </div>
  )
}
