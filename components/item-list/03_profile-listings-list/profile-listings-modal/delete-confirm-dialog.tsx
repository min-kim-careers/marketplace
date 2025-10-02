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
import { useItemHandler } from '@/lib/hooks/use-item-handler'
import { Item } from '@/lib/types/item'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'

export default function DeleteConfirmDialog({
  children,
  item,
}: {
  children: ReactNode
  item: Item
}) {
  const { handleDelete } = useItemHandler()
  const router = useRouter()

  const handleClick = async () => {
    if (await handleDelete(item)) {
      router.refresh()
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>No, close this</AlertDialogCancel>
          <AlertDialogAction onClick={handleClick} className='bg-red-500'>
            Yes, I&apos;m sure
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
