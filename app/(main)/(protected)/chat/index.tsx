'use client'

import ChatRoomList from '@/chat/chat-room-list'
import useChatStore from '@/chat/chat-store'
import ChatWindow from '@/chat/chat-window'
import useProfileStore from '@/lib/stores/profile-store'

export default function Chat() {
  const { profile } = useProfileStore()
  const { messages, currentRoom } = useChatStore()

  return (
    <div className='flex h-[92vh] gap-2 rounded border p-2'>
      <ChatRoomList />

      <ChatWindow />
    </div>
  )
}
