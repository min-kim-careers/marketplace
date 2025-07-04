import { Button } from '@/components/shadcn/components/ui/button'
import { cn } from '@/components/shadcn/lib/utils'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { IChatRoom } from '@/lib/interfaces/chat-room'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export function ChatSidebar({
  existingRooms,
  toggleSidebar,
}: {
  existingRooms: IChatRoom[]
  toggleSidebar: () => void
}) {
  return (
    <div className='flex h-full w-full flex-1 flex-col items-center justify-start'>
      <div className='flex w-full justify-end border-b p-2'>
        <button
          className='transition-transform duration-200 hover:scale-110'
          onClick={toggleSidebar}
        >
          <Menu />
        </button>
      </div>
      <div className='flex w-full flex-1 flex-col gap-2 p-2'>
        {existingRooms.map((room, i) => (
          <Link
            key={i}
            href={`${APP_ROUTES.CHAT.href}?${new URLSearchParams({ item: 'QJYDuZyHR0SfMcWFdAV04Q', handle: 'userf6effb3d50' })}`}
            className={cn(
              'w-full',
              room.id === '9b447c2e-603a-48fc-833d-70b1b1094110' &&
                'pointer-events-none',
            )}
          >
            <Button
              variant='secondary'
              disabled={room.id === '9b447c2e-603a-48fc-833d-70b1b1094110'}
              className='w-full line-clamp-1 truncate rounded border transition-transform duration-200 hover:scale-105 h-16'
            >
              {room.id}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  )
}
