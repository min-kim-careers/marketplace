'use client'

import ChatRoom from '@/components/00_common/chat/chat-room'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/shadcn/components/ui/resizable'
import { IChatRoom } from '@/lib/interfaces/chat-session'
import useFirebaseStore from '@/lib/stores/firebase-store'
import { useEffect, useState } from 'react'

export default function Chat({
  currentRoom: _currentRoom,
  existingRooms,
}: {
  currentRoom?: IChatRoom
  existingRooms: IChatRoom[]
}) {
  const { user, getToken } = useFirebaseStore()
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const loadToken = async () => {
      if (user) {
        const t = await getToken()
        setToken(t)
      }
    }
    loadToken()
  }, [user])

  const [currentRoom, setCurrentRoom] =
    useState<IChatRoom | null>(_currentRoom ?? null)

  return (
    <ResizablePanelGroup
      direction='horizontal'
      className='flex flex-1 rounded-lg border'
    >
      <ResizablePanel
        defaultSize={25}
        minSize={25}
        maxSize={50}
        className='p-2'
      >
        <div className='flex h-full w-full flex-1 flex-col items-center justify-start'>
          {existingRooms.map((session, i) => (
            <div
              key={i}
              className='flex cursor-pointer items-center justify-center rounded-lg border p-2'
            >
              {session.roomId}
            </div>
          ))}
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel className='flex' defaultSize={75}>
        {!!currentRoom && !!token && (
          <ChatRoom
            session={currentRoom}
            token={token}
          />
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
