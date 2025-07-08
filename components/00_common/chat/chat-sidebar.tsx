import { cn } from '@/components/shadcn/lib/utils'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { useIsMobile } from '@/lib/hooks/use-is-mobile'
import { useChatPageStore } from '@/lib/providers/chat-page-provider'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export function ChatSidebar({ className }: { className?: string }) {
  const currentRoom = useChatPageStore((store) => store.currentRoom)
  const existingRooms = useChatPageStore((store) => store.existingRooms)
  const isMobile = useIsMobile()

  const [open, setOpen] = useState<boolean>(false)

  // if (isMobile) return null

  return (
    <div
      className={cn(
        'transition-all duration-300 ease-in-out',
        open ? (isMobile ? 'w-1/2' : 'w-80') : 'w-12',
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
          <Link
            key={i}
            href={`${APP_ROUTES.CHAT.href}?${new URLSearchParams({ roomId: room.id })}`}
            className={cn((currentRoom && currentRoom.id === room.id || !open) && 'pointer-events-none')}
          >
            <button
              className={cn(
                'line-clamp-1 h-16 w-full truncate rounded-xl border bg-gray-100 px-2 transition-colors duration-200 hover:bg-gray-300',
                currentRoom && currentRoom.id === room.id && 'rounded-xl border-4 border-gray-400',
              )}
            >
              {room.id}
            </button>
          </Link>
        ))}
      </div>
    </div>
  )
}
