'use client'

import ChatRoomList from '@/chat/chat-room-list'
import ChatToolbar from '@/chat/chat-toolbar'
import ChatWindow from '@/chat/chat-window'
import ChatProvider from '@/chat/providers/chat-provider'
import useChatStore from '@/chat/stores/chat-store'
import { Button } from '@/components/shadcn/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/shadcn/components/ui/sheet'
import { cn } from '@/components/shadcn/lib/utils'
import { useState } from 'react'

export default function ChatDrawer() {
  const [open, setOpen] = useState<boolean>(false)
  const status = useChatStore((state) => state.status)

  return (
    <Sheet open={open} onOpenChange={() => setOpen(!open)}>
      <SheetTrigger asChild>
        <Button>Chat</Button>
      </SheetTrigger>

      <SheetContent
        side='right'
        className={cn(
          'flex flex-1',
          '[state=closed]:duration-200 data-[state=open]:duration-200',
          'sm:max-w-screen w-3/4',
        )}
      >
        <SheetHeader>
          <SheetTitle />
        </SheetHeader>
        <ChatProvider>
          <div className='flex flex-1 flex-row gap-2 pr-4'>
            <div className='flex-[1]'>
              <ChatRoomList />
            </div>
            <div className='flex flex-[3] flex-col gap-2'>
              <div className='h-[5%]'>
                <ChatToolbar />
              </div>
              <div className='h-[95%]'>
                <ChatWindow />
              </div>
            </div>
          </div>
        </ChatProvider>
      </SheetContent>
    </Sheet>
  )
}
