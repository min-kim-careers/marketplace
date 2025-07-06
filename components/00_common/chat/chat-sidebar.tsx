import { cn } from '@/components/shadcn/lib/utils'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { useIsMobile } from '@/lib/hooks/use-is-mobile'
import { useChatPageStore } from '@/lib/providers/chat-page-provider'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export function ChatSidebar({ className }: { className?: string }) {
  const existingRooms = useChatPageStore((store) => store.existingRooms)
  const isMobile = useIsMobile()

  const [open, setOpen] = useState<boolean>(false)

  if (isMobile) return null

  return (
    <div
      className={cn(
        'transition-all duration-300 ease-in-out',
        open ? 'w-80' : 'w-12',
        className,
      )}
    >
      <div
        className={cn(
          'flex h-10 w-full items-center border-b pl-2 transition-all duration-300 ease-in-out',
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
          'flex flex-col gap-2 overflow-y-auto py-2 transition-opacity duration-300 ease-in-out',
          open ? 'opacity-100' : 'opacity-0',
        )}
      >
        {[...existingRooms, ...existingRooms].map((room, i) => (
          <Link
            key={i}
            href={`${APP_ROUTES.CHAT.href}?${new URLSearchParams({ item: 'QJYDuZyHR0SfMcWFdAV04Q', handle: 'userf6effb3d50' })}`}
            className={cn((i == 0 || !open) && 'pointer-events-none')}
          >
            <button
              className={cn(
                'line-clamp-1 h-16 w-full truncate border-b border-t bg-gray-100 px-2 transition-colors duration-300 hover:bg-gray-300',
                i == 0 && 'rounded border-2 border-gray-300',
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
