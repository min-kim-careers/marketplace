import { getRooms } from '@/api/service/chat'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn/components/ui/dialog'
import { PropsWithChildren, useEffect, useState } from 'react'

export default function ChatOverlay({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const loadRooms = async () => {
      await getRooms()
    }

    loadRooms()
  }, [])

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='max-h-[90vh] min-h-[50vh] overflow-auto'>
        <DialogTitle>Chat</DialogTitle>
      </DialogContent>
    </Dialog>
  )
}
