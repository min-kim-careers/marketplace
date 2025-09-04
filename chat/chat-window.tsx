'use client'

import { useChatContext } from '@/chat/chat-provider'
import useChatStore from '@/chat/chat-store'
import MessageBubble from '@/chat/message-bubble'
import { Button } from '@/components/shadcn/components/ui/button'
import { Input } from '@/components/shadcn/components/ui/input'
import { cn } from '@/components/shadcn/lib/utils'
import { FormEvent, useEffect } from 'react'

export default function ChatWindow() {
  const { joinedRoom, setJoinedRoom } = useChatStore()
  const messages = useChatStore((state) => state.messages)
  const { sendTextMessage } = useChatContext()

  useEffect(() => {
    console.log(joinedRoom)
  }, [joinedRoom])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const input = e.currentTarget.input.value as string
    if (input) {
      sendTextMessage(input)
      e.currentTarget.reset()
    }
  }

  return (
    <div
      className={cn(
        'flex h-full flex-1 flex-col gap-2 rounded border p-2 transition-opacity',
        joinedRoom ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      {/* messages */}
      <div className='flex h-full flex-col-reverse gap-2 overflow-y-auto rounded border p-2'>
        {messages.map((m, i) => (
          <MessageBubble key={i} message={m} />
        ))}
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
