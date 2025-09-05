'use client'

import MessageBubble from '@/chat/message-bubble'
import { useChatContext } from '@/chat/providers/chat-provider'
import useChatStore from '@/chat/stores/chat-store'
import { Button } from '@/components/shadcn/components/ui/button'
import { Input } from '@/components/shadcn/components/ui/input'
import { FormEvent, useEffect, useRef, useState } from 'react'

const useScrollHandler = (mount: boolean) => {
  const ref = useRef<HTMLDivElement>(null)
  const [atTop, setAtTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        setAtTop(ref.current.scrollTop === 0)
      }
    }

    if (ref.current) {
      ref.current.addEventListener('scroll', handleScroll)
      handleScroll()
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener('scroll', handleScroll)
      }
    }
  }, [mount])

  useEffect(() => {
    console.log(atTop)
  }, [atTop])

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight
    }
  }, [mount])

  return { ref, atTop }
}

export default function ChatWindow() {
  const { joinedRoom } = useChatStore()
  const messages = useChatStore((state) => state.messages)
  const { sendTextMessage } = useChatContext()
  const { atTop, ref } = useScrollHandler(joinedRoom)

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
        <div className='flex w-full flex-col-reverse gap-2'>
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
