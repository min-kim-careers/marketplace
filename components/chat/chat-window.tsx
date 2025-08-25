'use client'

import { Button } from '@/components/shadcn/components/ui/button'
import { Input } from '@/components/shadcn/components/ui/input'
import { cn } from '@/components/shadcn/lib/utils'
import Spinner from '@/components/spinner'
import { formatDate } from '@/lib/helpers/format-date'
import { useChatContext } from '@/lib/providers/chat-provider'
import useProfileStore from '@/lib/stores/profile-store'
import { ChatMessage } from '@/lib/types/chat-message'
import { Minus, X } from 'lucide-react'
import { FormEvent, useEffect, useRef, useState } from 'react'

export default function ChatWindow() {
  const [open, setOpen] = useState<boolean>(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const { profile } = useProfileStore()

  const {
    hook: {
      getWebSocket,
      // lastJsonMessage,
      // lastMessage,
      readyState,
      sendJsonMessage,
    },
    messages,
    room,
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
        'fixed bottom-0 right-0 z-40 m-2 flex rounded border bg-background shadow transition-all duration-300',
        open
          ? 'h-[36rem] max-h-[95vh] w-96'
          : 'h-16 w-32 rounded-xl hover:scale-105',
      )}
    >
      {open && room && profile ? (
        <div className='relative flex flex-1 flex-col gap-2 p-2'>
          {/* header */}
          <div className='flex items-center justify-between'>
            <span>
              <span className='font-semibold'>{room.item.name}</span>
              {room.item.profile.handle === profile.handle && (
                <span> - {room.item.profile.handle}</span>
              )}
            </span>

            <span className='space-x-2'>
              <button onClick={() => setOpen(false)}>
                <Minus />
              </button>
              <button onClick={() => getWebSocket()?.close()}>
                <X />
              </button>
            </span>
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
      ) : room ? (
        <button
          onClick={() => setOpen(true)}
          className='flex flex-1 items-center justify-center p-2'
        >
          {room.item.name}
        </button>
      ) : (
        <Spinner />
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
      <div
        className={cn(
          'flex items-center gap-1 rounded-2xl border p-2',
          message.isMe ? '' : 'bg-secondary',
        )}
      >
        <span>{message.content}</span>
        <span className='text-xs'>{formatDate(message.timestamp)}</span>
      </div>
    </div>
  )
}
