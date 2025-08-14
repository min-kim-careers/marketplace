'use client'

import { Button } from '@/components/shadcn/components/ui/button'
import { Input } from '@/components/shadcn/components/ui/input'
import { cn } from '@/components/shadcn/lib/utils'
import { useChatContext } from '@/lib/providers/chat-provider'
import { X } from 'lucide-react'
import { useState } from 'react'

export default function Chat() {
  const [open, setOpen] = useState<boolean>(true)

  const { messages, send } = useChatContext()
  const [input, setInput] = useState<string>('')

  return (
    <div
      className={cn(
        'fixed bottom-0 right-0 m-4 flex rounded-xl border bg-background transition-all duration-300',
        open ? 'h-[36rem] w-96' : 'h-16 w-16',
      )}
    >
      {open ? (
        <div className='relative flex flex-1 flex-col gap-2 p-2'>
          <div className='flex items-center justify-end'>
            <button onClick={() => setOpen(false)}>
              <X />
            </button>
          </div>
          <div className='flex flex-1 flex-col gap-2'>
            <div className='h-full w-full flex-[12] rounded-lg border bg-background'>
              {messages.map((m, i) => (
                <p key={i}>{m.body}</p>
              ))}
            </div>
            <div className='flex flex-1 items-center gap-2'>
              <Input
                type='text'
                className='h-full flex-[4] rounded-lg'
                onChange={(e) => setInput(e.currentTarget.value)}
                value={input}
              />
              <Button
                className='h-full flex-1 rounded-lg'
                onClick={() => input && send(input) && setInput('')}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className='h-full w-full' />
      )}
    </div>
  )
}
