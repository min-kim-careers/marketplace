import { ChatBubble } from '@/components/00_common/chat/chat-bubble'
import { useChatSocket } from '@/components/00_common/chat/hooks/use-chat-socket'
import LoadingDots from '@/components/00_common/loading-dots'
import { Button } from '@/components/shadcn/components/ui/button'
import { Input } from '@/components/shadcn/components/ui/input'
import { IChatRoom } from '@/lib/interfaces/chat-room'
import useProfileStore from '@/lib/stores/profile-store'
import { X } from 'lucide-react'
import { FormEvent } from 'react'

export default function ChatWindow({
  room,
  token,
}: {
  room: IChatRoom | null
  token: string
}) {
  if (!room) return null

  const { profile } = useProfileStore()
  const {
    messages,
    noMessages,
    loading,
    isChatting,

    sendChat,
    leaveChat,
  } = useChatSocket({
    token,
    room,
  })

  const handleSend = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const input = e.currentTarget.input as HTMLInputElement
    if (input) {
      const value = input.value
      sendChat(value)
      input.value = ''
    }
  }

  if (!profile || loading)
    return (
      <div className='flex flex-1 items-center justify-center'>
        <LoadingDots />
      </div>
    )

  if (!isChatting) return null

  return (
    <div className='flex flex-1 flex-col gap-2 p-2'>
      <div className='flex flex-1 flex-col rounded-lg border'>
        <div className='flex w-full justify-between border-b p-2 items-center pl-4'>
          <span>{room.id}</span>
          <button className='transition-transform duration-200 hover:scale-110' onClick={leaveChat}>
            <X />
          </button>
        </div>

        <div className='flex flex-1 flex-col-reverse gap-2 p-2 overflow-y-scroll flex-shrink-0 max-h-[80vh]'>
          {messages.map((m, i) => (
            <ChatBubble key={i} message={m} profile={profile} />
          ))}
        </div>
      </div>

      <form onSubmit={handleSend} className='flex flex-row gap-2'>
        <Input name='input' />
        <Button type='submit'>Send</Button>
      </form>
    </div>
  )
}
