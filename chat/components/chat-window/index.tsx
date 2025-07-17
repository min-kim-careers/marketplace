import { ChatPane } from '@/chat/components/chat-window/pane'
import ChatWindowHeader from '@/chat/components/chat-window/header'
import { useChatSocketContext } from '@/chat/providers/chat-socket-provider'
import { Button } from '@/components/shadcn/components/ui/button'
import { Input } from '@/components/shadcn/components/ui/input'
import { cn } from '@/components/shadcn/lib/utils'
import { useIsMobile } from '@/lib/hooks/use-is-mobile'
import useLayoutStore from '@/lib/stores/layout-store'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'

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
