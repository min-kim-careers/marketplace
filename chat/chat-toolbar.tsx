import ChatRoomList from '@/chat/chat-room-list'
import useChatStore from '@/chat/stores/chat-store'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/shadcn/components/ui/avatar'
import { formatCurrency } from '@/lib/helpers/format-price'
import { ArrowLeft } from 'lucide-react'

export default function ChatToolbar() {
  const currentRoom = useChatStore((state) => state.currentRoom)
  const { setProps } = useChatStore()

  return (
    <div className='flex items-center space-x-2 rounded border p-1 px-3 text-sm text-black/80'>
      <span className='flex flex-[1] items-center'>
        <ArrowLeft
          onClick={() => setProps({ open: false })}
          className='cursor-pointer transition-all hover:scale-105 active:scale-95'
        />
      </span>

      <span className='flex-[12] py-2'>
        {currentRoom ? (
          <span className='flex items-center gap-2'>
            <Avatar className='h-8 w-8'>
              <AvatarImage src={currentRoom.item.previewUrl} />
              <AvatarFallback>
                <p className='text-lg font-bold'>-</p>
              </AvatarFallback>
            </Avatar>
            <div className='flex flex-col'>
              <span className=''>{currentRoom.peer.handle}</span>
              <span className='text-base'>
                {formatCurrency(currentRoom.item.price)} -{' '}
                {currentRoom.item.name}
              </span>
            </div>
          </span>
        ) : (
          <span className='flex flex-1 items-center justify-center text-base'>
            Select a room
          </span>
        )}
      </span>

      <span className='flex flex-[1] items-center'>
        <ChatRoomList />
      </span>
    </div>
  )
}
