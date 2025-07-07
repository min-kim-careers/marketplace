import { ChatBubble } from '@/components/00_common/chat/chat-bubble'
import LoadingDots from '@/components/00_common/loading-dots'
import { Button } from '@/components/shadcn/components/ui/button'
import { Input } from '@/components/shadcn/components/ui/input'
import { IChatMessageChat } from '@/lib/interfaces/chat-message'
import { useChatPageStore } from '@/lib/providers/chat-page-provider'
import { X } from 'lucide-react'
import { FormEvent } from 'react'

export default function ChatWindow({
  messages,
  leaveChat,
  sendChat,
  loading,
  className,
}: {
  messages: IChatMessageChat[]
  leaveChat: () => void
  sendChat: (text: string) => void
  loading: boolean
  className?: string
}) {
  const currentRoom = useChatPageStore((store) => store.currentRoom)

  const handleSend = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const input = e.currentTarget.input as HTMLInputElement
    if (input && input.value) {
      sendChat(input.value)
      input.value = ''
    }
  }

  if (loading)
    return (
      <div className={className}>
        <div className='flex h-full flex-col items-center justify-center rounded-lg border'>
          <LoadingDots />
        </div>
      </div>
    )

  return (
    <div className={className}>
      <div className='flex h-full flex-col gap-2 overflow-hidden rounded-lg border p-2'>
        <div className='flex min-h-8 items-center justify-between rounded-lg border p-1'>
          <p className='pl-2 font-semibold'>{currentRoom?.id}</p>
          {currentRoom && (
            <button
              className='transition-transform duration-200 hover:scale-110'
              onClick={leaveChat}
            >
              <X />
            </button>
          )}
        </div>

        <div className='flex h-full flex-col-reverse gap-2 overflow-y-auto'>
          {messages.map((m, i) => (
            <ChatBubble key={i} message={m} />
          ))}
        </div>

        <form onSubmit={handleSend} className='flex flex-row gap-2'>
          <Input name='input' />
          <Button type='submit'>Send</Button>
        </form>
      </div>
    </div>
  )
}
