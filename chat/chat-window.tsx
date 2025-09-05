'use client'

import { useScrollHandler } from '@/chat/hooks/use-scroll-handler'
import MessageBubble from '@/chat/message-bubble'
import { useChatContext } from '@/chat/providers/chat-provider'
import useChatStore from '@/chat/stores/chat-store'
import LoadingDots from '@/components/loading-dots'
import { Button } from '@/components/shadcn/components/ui/button'
import { Input } from '@/components/shadcn/components/ui/input'
import { cn } from '@/components/shadcn/lib/utils'
import { delay } from '@/lib/helpers/delay'
import { FormEvent, useEffect, useState } from 'react'

export default function ChatWindow() {
  const { joinedRoom } = useChatStore()
  const messages = useChatStore((state) => state.messages)
  const noMessages = useChatStore((state) => state.noMessages)
  const { sendTextMessage, sendRestoreMessage } = useChatContext()
  const { atTop, ref, nudgeDown } = useScrollHandler(joinedRoom)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const handleAtTop = async () => {
      if (atTop && !noMessages) {
        try {
          setLoading(true)
          await delay(2000)
          sendRestoreMessage()
        } catch (error) {
        } finally {
          setLoading(false)
        }
      }
    }

    handleAtTop()
  }, [atTop])

  useEffect(() => nudgeDown(), [messages.length])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const input = e.currentTarget.input.value as string
    if (input) {
      sendTextMessage(input)
      e.currentTarget.reset()
    }
  }

  if (!joinedRoom) return null

  return (
    <div className='flex h-full flex-col gap-2'>
      {/* messages */}
      <div className='h-full overflow-y-auto rounded border p-2' ref={ref}>
        <div
          className={cn(
            'transition-all',
            loading ? 'translate-y-0' : '-translate-y-10',
          )}
        >
          <LoadingDots />
        </div>

        {noMessages && (
          <div className='mb-2 flex items-center justify-center italic text-black/50'>
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
