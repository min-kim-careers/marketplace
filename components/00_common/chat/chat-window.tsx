import { ChatBubble } from '@/components/00_common/chat/chat-bubble'
import LoadingDots from '@/components/00_common/loading-dots'
import { Button } from '@/components/shadcn/components/ui/button'
import { Input } from '@/components/shadcn/components/ui/input'
import { cn } from '@/components/shadcn/lib/utils'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { useIsMobile } from '@/lib/hooks/use-is-mobile'
import { useChatPageStore } from '@/lib/providers/chat-page-provider'
import { useChatSocketContext } from '@/lib/providers/chat-socket-provider'
import useLayoutStore from '@/lib/stores/layout-store'
import { X } from 'lucide-react'
import Link from 'next/link'
import { FormEvent } from 'react'

export default function ChatWindow({ className }: { className?: string }) {
  const { currentRoom } = useChatPageStore()
  const { sendChat, messages } = useChatSocketContext()
  const { chatSidebarOpen } = useLayoutStore()
  const isMobile = useIsMobile()

  const handleSend = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const input = e.currentTarget.input as HTMLInputElement
    if (input && input.value) {
      sendChat(input.value)
      input.value = ''
    }
  }
  
  return (
    <div
      className={cn(
        'transition-all duration-300 ease-in-out',
        chatSidebarOpen ? (isMobile ? 'w-1/2' : 'w-2/3') : 'w-full',
        className,
      )}
    >
      <div
        className={cn(
          'flex h-full min-w-full flex-col gap-2 overflow-hidden rounded-lg border p-2',
        )}
      >
        <div className='flex min-h-8 items-center justify-between rounded-lg border p-1'>
          <div className='pl-2'>
            {currentRoom && (
              <div className='flex flex-row'>
                <p>
                  Chatting with{' '}
                  <span className='font-semibold'>
                    {currentRoom.item.profileHandle}
                  </span>{' '}
                  about{' '}
                  <span className='font-semibold'>{currentRoom.item.name}</span>
                </p>
              </div>
            )}
          </div>
          {currentRoom && (
            <Link
              className='transition-transform duration-200 hover:scale-110'
              href={`${APP_ROUTES.CHAT.href}/${APP_ROUTES.CHAT.index}`}
            >
              <X />
            </Link>
          )}
        </div>

        <div className='flex h-full flex-col-reverse gap-2 overflow-y-auto'>
          {messages.map((m, i) => (
            <ChatBubble key={i} message={m} />
          ))}
        </div>

        <form onSubmit={handleSend} className='flex flex-row gap-2'>
          <Input name='input' />
          <Button type='submit'>Send</Button>
        </form>
      </div>
    </div>
  )
}
