'use client'

import ChatSession from '@/components/00_common/chat/chat-session'
import Spinner from '@/components/00_common/spinner'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/shadcn/components/ui/resizable'
import { IChatSession } from '@/lib/interfaces/chat-session'
import useProfileStore from '@/lib/stores/profile-store'
import { useEffect, useState } from 'react'

export default function Chat({
  roomId,
  existingSessions = [],
}: {
  roomId?: string
  existingSessions?: IChatSession[]
}) {
  const { profile } = useProfileStore()

  const [currentSession, setCurrentSession] =
    useState<IChatSession | null>(null)

  useEffect(() => {
    if (profile && roomId) {
      setCurrentSession({
        clientId: profile.handle,
        roomId,
      })
    }
  }, [profile])

  return (
    <ResizablePanelGroup
      direction='horizontal'
      className='flex flex-1 rounded-lg border'
    >
      <ResizablePanel
        defaultSize={25}
        minSize={25}
        maxSize={50}
      >
        <div className='flex w-full flex-col items-center justify-start p-4'>
          {existingSessions.map((session, i) => (
            <div
              key={i}
              className='flex cursor-pointer items-center justify-center rounded-lg border p-2'
            >
              {session.clientId}
            </div>
          ))}
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel className='flex' defaultSize={75}>
        {!!currentSession && (
          <ChatSession session={currentSession} />
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
