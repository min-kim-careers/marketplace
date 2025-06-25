import { DELETE_ITEM } from '@/_gateway/api/item/service'
import ItemImagePreview from '@/components/00_common/item-image-preview'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/components/ui/select'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { ITEM_CONDITION_LABELS } from '@/lib/constants/item-condition-labels'
import { ITEM_STATUS_COLORS } from '@/lib/constants/item-status-colors'
import { ITEM_STATUS_LABELS } from '@/lib/constants/item-status-labels'
import { ItemStatus } from '@/lib/enums/item-status'
import { formatCurrency } from '@/lib/helpers/format-price'
import { useUpsertItem } from '@/lib/hooks/use-upsert-item'
import { Item } from '@/lib/interfaces/item'
import { useItemPageContext } from '@/lib/providers/item-page-provider'
import { useLoadingStore } from '@/lib/stores/loading-store'
import { formatDistanceToNow } from 'date-fns'
import { Circle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ReactNode, useState } from 'react'
import { toast } from 'sonner'

export default function ListingsModal({
  children,
  item,
  index,
}: {
  children: ReactNode
  item: Item
  index: number
}) {
  const updatedAt = () =>
    formatDistanceToNow(item.updatedAt.toLocaleString(), {
      addSuffix: true,
    })

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='max-h-[90vh] overflow-auto'>
        <DialogHeader className='flex-row justify-between'>
          <span className='flex w-full flex-col justify-around'>
            <DialogTitle className='flex w-full flex-row justify-between'>
              <span className='flex items-center gap-2'>
                <span className='italic opacity-50'>
                  {ITEM_CONDITION_LABELS[item.condition]}
                </span>
                <span>{item.name}</span>
              </span>
              <span className='pr-4'>
                <ItemStatusSelect
                  item={item}
                  index={index}
                />
              </span>
            </DialogTitle>
            <DialogDescription className='flex gap-2'>
              <span>{`Last update at ${updatedAt()}`}</span>
            </DialogDescription>
          </span>
        </DialogHeader>

        <div className='flex flex-1 flex-col gap-4'>
          <div className='flex-1'>{item.description}</div>

          <div className='relative flex-1 rounded shadow'>
            <ItemImagePreview imageUrls={item.imageUrls} />
          </div>
        </div>

        <DialogFooter className='items-center sm:justify-between'>
          <span className='font-semibold'>
            {formatCurrency(item.price.toString())}
          </span>

          <span className='flex flex-row items-center gap-2'>
            <Link
              href={`${APP_ROUTES.ITEM_EDIT.href}/${item.id}`}
            >
              <Button variant={'outline'}>Edit</Button>
            </Link>

            <DeleteConfirmDialog item={item}>
              <Button variant={'outline'}>Delete</Button>
            </DeleteConfirmDialog>

            <Button variant={'outline'}>Show Chats</Button>
          </span>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const ItemStatusSelect = ({
  item,
  index,
}: {
  item: Item
  index: number
}) => {
  const { updateItemAtIndex } = useItemPageContext()

  const { handleUpsertItem } = useUpsertItem()

  const handleStatusChange = async (status: ItemStatus) => {
    if (await handleUpsertItem({ status }, item.id))
      updateItemAtIndex(index, {
        ...item,
        status,
      })
  }

  return (
    <div>
      <Select
        value={item.status}
        onValueChange={handleStatusChange}
      >
        <SelectTrigger className='w-32'>
          <SelectValue>
            <span className='flex flex-row items-center gap-2 pr-2'>
              <span>{ITEM_STATUS_LABELS[item.status]}</span>
              <span>
                <Circle
                  fill={ITEM_STATUS_COLORS[item.status]}
                  size={8}
                />
              </span>
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(ITEM_STATUS_LABELS).map(
            ([_status, label]) => (
              <SelectItem
                value={_status.toString()}
                key={_status}
              >
                <span>{label}</span>
              </SelectItem>
            ),
          )}
        </SelectContent>
      </Select>
    </div>
  )
}

const DeleteConfirmDialog = ({
  children,
  item,
}: {
  children: ReactNode
  item: Item
}) => {
  const { setLoading } = useLoadingStore()
  const router = useRouter()

  const handleDelete = async () => {
    try {
      setLoading('Deleting post', true)
      await DELETE_ITEM(item.id)
      router.replace(APP_ROUTES.PROFILE_LISTINGS.href)
      toast('Successfully deleted post')
    } catch (error) {
      toast('Something went wrong')
    } finally {
      setLoading(null)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>
            No, close this
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className='bg-red-500'
          >
            Yes, I'm sure
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
