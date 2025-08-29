import { Button } from '@/components/shadcn/components/ui/button'
import { Input } from '@/components/shadcn/components/ui/input'
import { FormEvent, useState } from 'react'

export default function MessageSection({ className }: { className?: string }) {
  const [messages, setMessages] = useState([])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const input = e.currentTarget.input.value as string
    if (input) {
      console.log(input)
      e.currentTarget.reset()
    }
  }

  return (
    <div className={className}>
      <div className='flex w-full flex-col gap-2'>
        <div className='text-xl font-bold'>Private messages</div>
        {messages.length ? <div></div> : <div>No messages...</div>}
        <form onSubmit={handleSubmit} className='flex flex-row gap-2'>
          <Input name='input' />
          <Button type='submit'>Send</Button>
        </form>
      </div>
    </div>
  )
}
