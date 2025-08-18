'use client'

import { Button } from '@/components/shadcn/components/ui/button'
import { Input } from '@/components/shadcn/components/ui/input'
import { cn } from '@/components/shadcn/lib/utils'
import { formatDate } from '@/lib/helpers/format-date'
import { useChatContext } from '@/lib/providers/chat-provider'
import { ChatMessage } from '@/lib/types/chat-message'
import { Minus } from 'lucide-react'
import { FormEvent, useEffect, useRef, useState } from 'react'

export default function Chat() {
  const [open, setOpen] = useState<boolean>(true)
  const containerRef = useRef<HTMLDivElement>(null)

  const {
    hook: {
      // getWebSocket,
      // lastJsonMessage,
      // lastMessage,
      readyState,
      sendJsonMessage,
    },
    messages,
  } = useChatContext()

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!readyState) return

    const input = e.currentTarget.input.value as string
    if (input) {
      sendJsonMessage(input)
      e.currentTarget.reset()
    }
  }

  return (
    <div
      className={cn(
        'fixed bottom-0 right-0 z-[75] m-2 flex rounded border-2 shadow bg-background transition-all duration-300',
        open ? 'h-[36rem] max-h-[95vh] w-96' : 'h-16 w-16',
      )}
    >
      {open ? (
        <div className='relative flex flex-1 flex-col gap-2 p-2'>
          {/* header */}
          <div className='flex items-center justify-end'>
            <button onClick={() => setOpen(false)}>
              <Minus />
            </button>
          </div>

          {/* main */}
          <div className='flex min-h-0 flex-1 flex-col gap-2'>
            {/* messages */}
            <div className='min-h-0 flex-[12] rounded border'>
              <div
                ref={containerRef}
                className='flex-end flex h-full flex-col-reverse gap-1 overflow-y-auto p-1'
              >
                {messages.map((m, i) => (
                  <MessageBubble key={i} message={m} />
                ))}
              </div>
            </div>

            {/* input */}
            <form
              onSubmit={handleSubmit}
              className='flex flex-1 items-center gap-2'
            >
              <Input
                name='input'
                type='text'
                className='h-full flex-[4] rounded'
              />
              <Button type='submit' className='h-full flex-1 rounded'>
                Send
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className='h-full w-full' />
      )}
    </div>
  )
}

function MessageBubble({ message }: { message: ChatMessage }) {
  return (
    <div
      className={cn(
        'flex items-center',
        message.isMe ? 'justify-end' : 'justify-start',
      )}
    >
      <div className='rounded-2xl border gap-1 flex p-2 items-baseline'>
        <span>{message.content}</span>
        <span className='text-xs'>{formatDate(message.timestamp)}</span>
      </div>
    </div>
  )
}
