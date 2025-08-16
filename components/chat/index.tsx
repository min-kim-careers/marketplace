'use client'

import { Button } from '@/components/shadcn/components/ui/button'
import { Input } from '@/components/shadcn/components/ui/input'
import { cn } from '@/components/shadcn/lib/utils'
import { useChatContext } from '@/lib/providers/chat-provider'
import { Minus } from 'lucide-react'
import { FormEvent, useState } from 'react'

export default function Chat() {
  const [open, setOpen] = useState<boolean>(true)

  const { messages, send } = useChatContext()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const input = e.currentTarget.input.value as string
    if (input) {
      send(input)
      e.currentTarget.reset() 
    }
  }

  return (
    <div
      className={cn(
        'fixed bottom-0 right-0 flex rounded border bg-background transition-all duration-300 m-2 z-[75]',
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
          <div className='flex flex-1 flex-col gap-2'>
            {/* messages */}
            <div className='h-full w-full flex-[12] rounded border bg-background'>
              <div className='flex flex-col-reverse h-full gap-1 p-1'>
                {messages.map((m, i) => (
                  <div key={i} className='border rounded p-2'>{m.content}</div>
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
