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
import { DELETE_ITEM } from '@/gateway/item'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { useLoadingStore } from '@/lib/providers/loading-provider'
import { Item } from '@/lib/types/item'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'
import { toast } from 'sonner'

export default function DeleteConfirmDialog ({
  children,
  item,
}: {
  children: ReactNode
  item: Item
})  {
  const { setLoading } = useLoadingStore()
  const router = useRouter()

  const handleDelete = async () => {
    try {
      setLoading('Deleting post', true)
      const { deleted } = await DELETE_ITEM(item.id)
      if (!deleted) throw new Error('failed to delete')

      router.replace(APP_ROUTES.PROFILE_LISTINGS.href)
      toast('Successfully deleted post')
    } catch (error) {
      toast('Something went wrong')
    } finally {
      setLoading()
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
          <AlertDialogAction onClick={handleDelete} className='bg-red-500'>
            Yes, I'm sure
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
