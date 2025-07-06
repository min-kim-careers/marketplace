import { ChatBubble } from '@/components/00_common/chat/chat-bubble'
import LoadingDots from '@/components/00_common/loading-dots'
import { Button } from '@/components/shadcn/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/shadcn/components/ui/dropdown-menu'
import { Input } from '@/components/shadcn/components/ui/input'
import { useIsMobile } from '@/lib/hooks/use-is-mobile'
import { IChatMessageChat } from '@/lib/interfaces/chat-message-chat'
import { IChatRoom } from '@/lib/interfaces/chat-room'
import { useChatPageStore } from '@/lib/providers/chat-page-provider'
import useProfileStore from '@/lib/stores/profile-store'
import { X } from 'lucide-react'
import { FormEvent } from 'react'

export default function ChatWindow({
  messages,
  leaveChat,
  sendChat,
  className,
}: {
  messages: IChatMessageChat[]
  leaveChat: () => void
  sendChat: (text: string) => void
  className?: string
}) {
  const currentRoom = useChatPageStore((store) => store.currentRoom)
  const existingRooms = useChatPageStore((store) => store.existingRooms)

  const isMobile = useIsMobile()

  const handleSend = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const input = e.currentTarget.input as HTMLInputElement
    if (input) {
      const value = input.value
      sendChat(value)
      input.value = ''
    }
  }

  const renderHeader = () => {
    const renderLeave = () => (
      <button
        className='transition-transform duration-200 hover:scale-110'
        onClick={leaveChat}
      >
        <X />
      </button>
    )

    return (
      <div className='flex min-h-8 items-center justify-between border-b pl-4'>
        {isMobile ? (
          <>
            <MobileRoomList
              existingRooms={existingRooms}
              currentRoom={currentRoom}
            />
            {currentRoom && renderLeave()}
          </>
        ) : (
          <>
            <p>{currentRoom ? currentRoom.id : 'No room'}</p>
            {currentRoom && renderLeave()}
          </>
        )}
      </div>
    )
  }

  return (
    <div className={className}>
      <div className='flex flex-col rounded-lg border overflow-hidden'>
        {renderHeader()}

        <div className='flex flex-col-reverse gap-2 overflow-y-auto p-2'>
          {[...Array(20)].map((m, i) => (
            <ChatBubble
              key={i}
              message={{
                clientId: '',
                content: 'message',
                createdAt: new Date().toISOString(),
                isMine: true,
                read: true,
                roomId: '',
              }}
            />
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

const MobileRoomList = ({
  currentRoom,
  existingRooms,
}: {
  currentRoom: IChatRoom | null
  existingRooms: IChatRoom[]
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {currentRoom ? (
          currentRoom.id
        ) : (
          <button className='w-1/2 rounded text-center'>Pick a room</button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent side='bottom' className='w-full'>
        {existingRooms.map((r, i) => (
          <div key={i}>
            <DropdownMenuItem key={i} className='text-md w-full p-4'>
              {r.id}
            </DropdownMenuItem>
            {i < existingRooms.length - 1 && <DropdownMenuSeparator />}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
