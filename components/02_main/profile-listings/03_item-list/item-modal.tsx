import ItemImagePreview from '@/components/02_main/profile-listings/00_common/item-image-preview'
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
  formatPrice,
  toUrlParams,
} from '@/lib/common/helpers'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { ITEM_CONDITION_LABELS } from '@/lib/constants/item-condition-labels'
import { ITEM_STATUS_LABELS } from '@/lib/constants/item-status-labels'
import { Item } from '@/lib/interfaces/item'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { ReactNode } from 'react'

export default function ItemModal({
  children,
  item,
}: {
  children: ReactNode
  item: Item
}) {
  const updatedAt = () =>
    formatDistanceToNow(item.updatedAt.toLocaleString(), {
      addSuffix: true,
    })

  console.log(item.status)

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='max-h-[90vh] overflow-auto'>
        <DialogHeader className='flex-row justify-between'>
          <span className='flex flex-col justify-around'>
            <DialogTitle className='space-x-2'>
              <span className='italic opacity-50'>
                {ITEM_CONDITION_LABELS[item.condition]}
              </span>
              <span>{item.name}</span>
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
            {formatPrice(item.price.toString())}
          </span>
          <span className='space-x-2'>
            <Button variant={'outline'}>
              {ITEM_STATUS_LABELS[item.status]}
            </Button>
            <Button variant={'outline'}>Chats</Button>
            <Link
              href={`${APP_ROUTES.ITEM_EDIT.url}?${toUrlParams({ item: null })}`}
            >
              <Button variant={'outline'}>Edit</Button>
            </Link>
            <Button variant={'destructive'}>Delete</Button>
          </span>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
