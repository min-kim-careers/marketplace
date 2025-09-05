'use client'

import ChatRoomList from '@/chat/chat-room-list'
import ChatWindow from '@/chat/chat-window'
import ChatProvider from '@/chat/providers/chat-provider'
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
            <div className='flex-[3]'>
              <ChatWindow />
            </div>
          </div>
        </ChatProvider>
      </SheetContent>
    </Sheet>
  )
}
