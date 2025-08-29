'use client'

import { ChatMessage } from '@/chat/chat-message'
import { useChatContext } from '@/chat/chat-provider'
import useChatStore from '@/chat/chat-store'
import { Button } from '@/components/shadcn/components/ui/button'
import { Input } from '@/components/shadcn/components/ui/input'
import { cn } from '@/components/shadcn/lib/utils'
import { formatDate } from '@/lib/helpers/format-date'
import useProfileStore from '@/lib/stores/profile-store'
import { FormEvent, useEffect, useRef } from 'react'

export default function ChatWindow() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { profile } = useProfileStore()
  const { messages, currentRoom } = useChatStore()
  const { sendJsonMessage, getWebSocket } = useChatContext()

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const input = e.currentTarget.input.value as string
    if (input) {
      sendJsonMessage(input)
      e.currentTarget.reset()
    }
  }

  return (
    <div className='flex flex-1 gap-2 rounded border p-2'>
      {/* left pane */}
      <div className='min-w-16 rounded border'></div>

      {/* right pane */}
      <div className='flex flex-1 flex-col gap-2 rounded border p-2'>
        {/* messages */}
        <div className='flex-1 rounded border'></div>

        {/* input */}
        <form onSubmit={handleSubmit} className='flex h-8 items-center gap-2'>
          <Input name='input' type='text' className='h-full flex-1 rounded' />
          <Button type='submit' className='h-full w-[15%] rounded'>
            Send
          </Button>
        </form>
      </div>
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
        <span className='text-xs text-black/50'>
          {formatDate(message.timestamp)}
        </span>
      </div>
    </div>
  )
}
