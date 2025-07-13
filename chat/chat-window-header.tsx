import { DELETE_ROOM_BY_ID } from '@/_gateway/chat/rooms/service'
import { useChatPageStore } from '@/chat/providers/chat-page-provider'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/shadcn/components/ui/alert-dialog'
import { Button } from '@/components/shadcn/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/shadcn/components/ui/dropdown-menu'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import useLoadingStore from '@/lib/stores/loading-store'
import { Ellipsis } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function ChatWindowHeader() {
  const { currentRoom } = useChatPageStore()

  if (!currentRoom) return null

  return (
    <div className='flex min-h-8 items-center justify-between rounded-lg border p-1 px-4'>
      <span className='flex flex-row'>
        <p>
          Chatting with{' '}
          <span className='font-semibold'>
            {currentRoom.item.profileHandle}
          </span>{' '}
          about <span className='font-semibold'>{currentRoom.item.name}</span>
        </p>
      </span>

      <span className='flex flex-row gap-4'>
        <span className='flex flex-row justify-end gap-2'>
          <Button className='my-2 h-8 w-20'>Sold</Button>
        </span>
        <span className='flex items-center justify-center'>
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Ellipsis />
              </DropdownMenuTrigger>
              <DropdownMenuContent side='bottom' align='end'>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </AlertDialogTrigger>
                <DropdownMenuItem asChild>
                  <Link href={APP_ROUTES.CHAT.indexHref}>Close</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DeleteConfirmDialog />
          </AlertDialog>
        </span>
      </span>
    </div>
  )
}

const DeleteConfirmDialog = () => {
  const { setLoading } = useLoadingStore()
  const router = useRouter()
  const { currentRoom } = useChatPageStore()

  const handleDelete = async () => {
    if (!currentRoom) return

    try {
      setLoading('Deleting session', true)
      if (!(await DELETE_ROOM_BY_ID(currentRoom.id))) throw new Error()
      router.replace(APP_ROUTES.CHAT.indexHref)
      toast('Successfully deleted post')
    } catch (error) {
      toast('Something went wrong')
    } finally {
      setLoading(null)
    }
  }

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogFooter>
        <AlertDialogCancel>No, close this</AlertDialogCancel>
        <AlertDialogAction className='bg-red-500' onClick={handleDelete}>
          Yes, I'm sure
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
