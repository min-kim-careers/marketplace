'use client'

import ChatSession from '@/components/00_common/chat/chat-session'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/shadcn/components/ui/resizable'
import { IChatSession } from '@/lib/interfaces/chat-session'
import useFirebaseStore from '@/lib/stores/firebase-store'
import { useEffect, useState } from 'react'

export default function Chat({
  session,
  existingSessions = [],
}: {
  session?: IChatSession
  existingSessions?: IChatSession[]
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

  const [currentSession, setCurrentSession] =
    useState<IChatSession | null>(session ?? null)

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
          {existingSessions.map((session, i) => (
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
        {!!currentSession && !!token && (
          <ChatSession
            session={currentSession}
            token={token}
          />
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
