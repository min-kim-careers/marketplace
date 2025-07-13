import { ChatBubble } from '@/chat/chat-bubble'
import ChatWindowHeader from '@/chat/chat-window-header'
import { useChatSocketContext } from '@/chat/providers/chat-socket-provider'
import { TypingAnimation } from '@/chat/ui/typing-animation'
import { Button } from '@/components/shadcn/components/ui/button'
import { Input } from '@/components/shadcn/components/ui/input'
import { cn } from '@/components/shadcn/lib/utils'
import { formatDate } from '@/lib/helpers/format-date'
import { useIsMobile } from '@/lib/hooks/use-is-mobile'
import useLayoutStore from '@/lib/stores/layout-store'
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'

export default function ChatWindow({ className }: { className?: string }) {
  const isMobile = useIsMobile()

  const { senders } = useChatSocketContext()
  const { chatSidebarOpen } = useLayoutStore()

  const [input, setInput] = useState<string>('')
  const [hadInput, setHadInput] = useState<boolean>(false)

  const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input) {
      senders.sendChat(input)
      setInput('')
    }
  }

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
    !hadInput && setHadInput(true)
  }

  useEffect(() => {
    if (input.length === 1) senders.sendTyping()
    if (hadInput && input.length === 0) senders.sendNotTyping()
  }, [input])

  return (
    <div
      className={cn(
        'transition-all duration-300 ease-in-out',
        chatSidebarOpen ? (isMobile ? 'w-1/2' : 'w-2/3') : 'w-full',
        className,
      )}
    >
      <div
        className={cn(
          'flex h-full min-w-full flex-col gap-2 overflow-hidden rounded-lg border p-2',
        )}
      >
        <ChatWindowHeader />

        <ChatPane />

        <form onSubmit={handleOnSubmit} className='flex flex-row gap-2'>
          <Input name='input' onChange={handleOnChange} value={input} />
          <Button type='submit'>Send</Button>
        </form>
      </div>
    </div>
  )
}

function ChatPane() {
  const { senders, messages, noMessages } = useChatSocketContext()
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = divRef.current
    if (!container) return

    const handleScroll = () => {
      const atTop =
        container.clientHeight - container.scrollTop >=
        container.scrollHeight - 1
      if (atTop) {
        console.log('Scrolled to top!')
        senders.sendRestore()
      }
    }

    const checkOverflow = () => {
      const isOverflowing =
        container.scrollHeight > container.clientHeight ||
        container.scrollWidth > container.clientWidth
      return isOverflowing
    }

    const handleWheel = (event: WheelEvent) => {
      if (!checkOverflow()) {
        if (event.deltaY < -50) {
          console.log('User attempted to scroll up')
          senders.sendRestore()
        }
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: true })
    container.addEventListener('scroll', handleScroll)
    return () => {
      container.removeEventListener('scroll', handleScroll)
      container.removeEventListener('wheel', handleWheel)
    }
  }, [])

  return (
    <div
      ref={divRef}
      className='flex flex-1 flex-col-reverse gap-2 overflow-y-auto'
    >
      <TypingAnimation />
      {messages.map((m, i) => {
        let dateDivider: string | null = null
        if (i < messages.length - 1) {
          const prevDate = new Date(messages[i + 1].createdAt)
          const currDate = new Date(messages[i].createdAt)

          const prevDayStart = new Date(
            prevDate.getFullYear(),
            prevDate.getMonth(),
            prevDate.getDate(),
          )
          const currDayStart = new Date(
            currDate.getFullYear(),
            currDate.getMonth(),
            currDate.getDate(),
          )
          if (currDayStart.getTime() > prevDayStart.getTime()) {
            dateDivider = formatDate(currDate)
          }
        } else if (i === messages.length - 1) {
          dateDivider = formatDate(new Date(messages[i].createdAt))
        }
        return (
          <div key={i}>
            {dateDivider && (
              <div className='my-4 flex items-center justify-center'>
                {dateDivider}
              </div>
            )}
            <ChatBubble message={m} />
          </div>
        )
      })}
    </div>
  )
}
