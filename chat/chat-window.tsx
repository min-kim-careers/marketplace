import { ChatBubble } from '@/chat/chat-bubble'
import LoadingDots from '@/components/00_common/loading-dots'
import { Button } from '@/components/shadcn/components/ui/button'
import { Input } from '@/components/shadcn/components/ui/input'
import { cn } from '@/components/shadcn/lib/utils'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { useIsMobile } from '@/lib/hooks/use-is-mobile'
import { useChatPageStore } from '@/chat/providers/chat-page-provider'
import { useChatSocketContext } from '@/chat/providers/chat-socket-provider'
import useLayoutStore from '@/lib/stores/layout-store'
import { X } from 'lucide-react'
import Link from 'next/link'
import { FormEvent, useEffect, useState } from 'react'

function TypingAnimation() {
  const { isTyping } = useChatSocketContext()

  return (
    <div
      className={cn(
        'flex justify-end transition-all ease-in-out duration-200 items-center mb-1',
        isTyping ? 'opacity-100 h-10' : 'opacity-0 h-0',
      )}
    >
      <div className='max-w-1/2 flex flex-col gap-1 rounded-xl border p-2'>
        <LoadingDots className='h-2 w-2' />
      </div>
    </div>
  )
}

export default function ChatWindow({ className }: { className?: string }) {
  const { currentRoom } = useChatPageStore()
  const { sendChat, messages, sendTyping, sendNotTyping } =
    useChatSocketContext()
  const { chatSidebarOpen } = useLayoutStore()
  const [input, setInput] = useState<string>('')
  const [hadInput, setHadInput] = useState<boolean>(false)
  const isMobile = useIsMobile()

  const handleInput = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input) {
      sendChat(input)
      setInput('')
    }
  }

  useEffect(() => {
    if (input.length === 1) sendTyping()
    if (hadInput && input.length === 0) sendNotTyping()
  }, [input])

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
          <TypingAnimation />
          {messages.map((m, i) => (
            <ChatBubble key={i} message={m} />
          ))}
        </div>

        <form onSubmit={handleInput} className='flex flex-row gap-2'>
          <Input
            name='input'
            onChange={(e) => {
              setInput(e.target.value)
              !hadInput && setHadInput(true)
            }}
            value={input}
          />
          <Button type='submit'>Send</Button>
        </form>
      </div>
    </div>
  )
}
