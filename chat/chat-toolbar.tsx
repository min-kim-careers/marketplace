import ChatRoomList from '@/chat/chat-room-list'
import useChatStore from '@/chat/stores/chat-store'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/shadcn/components/ui/avatar'
import { formatCurrency } from '@/lib/helpers/format-price'
import useProfileStore from '@/lib/stores/profile-store'

export default function ChatToolbar() {
  const currentRoom = useChatStore((state) => state.currentRoom)
  const { profile } = useProfileStore()

  return (
    <div className='flex items-center justify-between space-x-2 rounded border p-1 px-3 text-sm text-black/80'>
      <span>
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
          <span>Select a room</span>
        )}
      </span>

      <span>
        <ChatRoomList />
      </span>
    </div>
  )
}
