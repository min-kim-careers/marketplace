'use client'

import { unreadExists } from '@/api'
import ChatToolbar from '@/chat/chat-toolbar'
import ChatWindow from '@/chat/chat-window'
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
import { useEffect, useState } from 'react'

export default function ChatDrawer({ useButton }: { useButton?: boolean }) {
  const { open, setProps } = useChatStore()
  const [unreadNoti, setUnreadNoti] = useState<boolean>(false)

  useEffect(() => {
    const checkUnreadExists = async () => {
      setUnreadNoti(await unreadExists())
    }

    checkUnreadExists()
  }, [open])

  return (
    <Sheet open={open} onOpenChange={(open) => setProps({ open })}>
      {useButton ? (
        <SheetTrigger asChild>
          <Button className='relative'>
            Chat
            {unreadNoti && (
              <div className='absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-500' />
            )}
          </Button>
        </SheetTrigger>
      ) : (
        <SheetTrigger>Chat</SheetTrigger>
      )}

      <SheetContent
        side='right'
        className={cn(
          'flex flex-1',
          '[state=closed]:duration-200 data-[state=open]:duration-200',
          'min-w-[75vw] sm:min-w-[50vw]',
        )}
      >
        <SheetHeader>
          <SheetTitle />
        </SheetHeader>
        <div className='flex flex-1 flex-row gap-2'>
          <div className='flex w-full flex-col gap-2'>
            <ChatToolbar />
            <div className='h-[95%]'>
              <ChatWindow />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
