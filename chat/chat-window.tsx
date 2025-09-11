'use client'

import { useScrollHandler } from '@/chat/hooks/use-scroll-handler'
import MessageBubble from '@/chat/message-bubble'
import { useChatContext } from '@/chat/providers/chat-provider'
import useChatStore from '@/chat/stores/chat-store'
import { ChatStatus } from '@/chat/types/chat-status'
import LoadingDots from '@/components/loading-dots'
import { Button } from '@/components/shadcn/components/ui/button'
import { Input } from '@/components/shadcn/components/ui/input'
import { cn } from '@/components/shadcn/lib/utils'
import { delay } from '@/lib/helpers/delay'
import { FormEvent, useEffect, useState } from 'react'

const activeStatus: ChatStatus[] = ['joining', 'joined', 'idling'] as const
const isActive = (status: ChatStatus) => activeStatus.includes(status)

export default function ChatWindow() {
  const messages = useChatStore((state) => state.messages)
  const noMessages = useChatStore((state) => state.noMessages)
  const status = useChatStore((state) => state.status)
  const currentRoom = useChatStore((state) => state.currentRoom)

  const { sendTextOut, sendRestoreOut } = useChatContext()
  const { atTop, scrollRef, handleAtTop } = useScrollHandler()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const handleScrollRestore = async () => {
      if (atTop && !noMessages) {
        try {
          setLoading(true)
          await delay(1000)
          sendRestoreOut()
        } catch (error) {
        } finally {
          setLoading(false)
        }
      }
    }

    handleScrollRestore()
  }, [atTop])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const input = e.currentTarget.input.value as string
    if (input) {
      sendTextOut(input)
      e.currentTarget.reset()
    }
  }

  if (!currentRoom || !isActive(status)) return null

  if (status === 'joining') {
    return (
      <div className='flex h-full flex-col items-center justify-center gap-2'>
        <LoadingDots />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex h-full flex-col gap-2',
        status === 'idling' && 'pointer-events-none opacity-50',
      )}
    >
      {/* messages */}
      <div
        className='h-full overflow-y-auto rounded border p-2'
        onScroll={handleAtTop}
        ref={scrollRef}
      >
        <div
          className={cn(
            'transition-all',
            loading ? 'translate-y-0' : '-translate-y-10',
          )}
        >
          <LoadingDots />
        </div>

        {noMessages && (
          <div className='-mt-4 mb-2 flex items-center justify-center italic text-black/50'>
            No more messages..
          </div>
        )}

        <div className='flex min-h-full w-full flex-col-reverse gap-2'>
          {messages.map((m, i) => (
            <MessageBubble message={m} key={i} />
          ))}
        </div>
      </div>

      {/* input */}
      <form onSubmit={handleSubmit} className='flex h-8 items-center gap-2'>
        <Input name='input' type='text' className='h-full flex-1 rounded' />
        <Button type='submit' className='h-full w-[15%] rounded'>
          Send
        </Button>
      </form>
    </div>
  )
}
