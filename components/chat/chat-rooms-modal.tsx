import { getRooms } from '@/api/service/chat'
import LoadingDots from '@/components/loading-dots'
import {
  AvatarFallback,
  AvatarImage,
} from '@/components/shadcn/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn/components/ui/dialog'
import Spinner from '@/components/spinner'
import { delay } from '@/lib/helpers/delay'
import { useChatContext } from '@/lib/providers/chat-provider'
import { ChatRoom } from '@/lib/types/chat-room'
import { Avatar } from '@radix-ui/react-avatar'
import { CircleUserIcon } from 'lucide-react'
import { PropsWithChildren, useEffect, useState } from 'react'

export default function ChatRoomsModal({ children }: PropsWithChildren) {
  const { room, setRoom } = useChatContext()

  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [loaded, setLoaded] = useState<boolean>(false)
  const [rooms, setRooms] = useState<ChatRoom[]>([])

  useEffect(() => {
    const loadRooms = async () => {
      if (loaded || !open) return

      try {
        setLoading(true)
        // await delay(2000)

        const rooms = await getRooms()
        if (!rooms) throw new Error()

        setRooms(rooms)
        setLoaded(true)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadRooms()
  }, [loaded, open])

  const handleRoomButton = (room: ChatRoom) => {
    setRoom(room)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={() => setOpen((o) => !o)}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className='flex max-h-[90vh] min-h-[50vh] flex-col'>
        <DialogHeader>
          <DialogTitle className='flex-start flex'>Chat</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className='flex flex-1 items-center justify-center'>
            <Spinner />
          </div>
        ) : (
          <div className='flex flex-1 flex-col gap-2 overflow-y-auto px-2'>
            {rooms.map((r: ChatRoom, i) => (
              <button
                key={i}
                className='flex items-center justify-center gap-1 rounded-lg border px-2 py-4 transition-all hover:scale-[1.02] hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-transparent'
                onClick={() => handleRoomButton(r)}
                disabled={!!room && room.id === r.id}
              >
                <span className='flex flex-row items-center gap-2'>
                  <Avatar>
                    <AvatarImage src={r.item.profile.avatarUrl} />
                    <AvatarFallback>
                      {r.item.profile ? <CircleUserIcon /> : <Spinner />}
                    </AvatarFallback>
                  </Avatar>
                  <span>{r.item.profile.handle}</span>
                </span>
                {`-`}
                <span className='font-semibold'>{r.item.name}</span>
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
