import DateFormatter from '@/components/date-formatter'
import ItemImageCarousel from '@/components/item-image-carousel'
import DeleteConfirmDialog from '@/components/item-list/03_profile-listings-list/profile-listings-modal/delete-confirm-dialog'
import ItemStatusSelect from '@/components/item-list/03_profile-listings-list/profile-listings-modal/item-status-select'
import { Button } from '@/components/shadcn/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn/components/ui/dialog'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { ITEM_CONDITION_LABELS } from '@/lib/constants/item-condition-labels'
import { formatCurrency } from '@/lib/helpers/format-price'
import { Item } from '@/lib/types/item'
import Link from 'next/link'
import { ReactNode } from 'react'

export default function ProfileListingsModal({
  children,
  item,
}: {
  children: ReactNode
  item: Item
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className='max-h-[96vh] overflow-auto max-sm:max-w-[96vw]'>
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
                <ItemStatusSelect item={item} />
              </span>
            </DialogTitle>

            <DialogDescription className='flex gap-2'>
              <span>
                Last update at <DateFormatter date={item.updatedAt} />
              </span>
            </DialogDescription>
          </span>
        </DialogHeader>

        <div className='flex flex-1 flex-col gap-4'>
          <div className='flex-1'>{item.description}</div>

          <div className='flex w-full items-center justify-center'>
            <div className='w-full'>
              <ItemImageCarousel imageUrls={item.imageUrls} rounded />
            </div>
          </div>
        </div>

        <div className='flex justify-between'>
          <p className='rounded-lg border p-2 font-semibold'>
            {formatCurrency(item.price.toString())}
          </p>

          <span className='flex items-center gap-2'>
            <Link href={`${APP_ROUTES.ITEM_EDIT.href}/${item.alias}`}>
              <Button variant={'outline'}>Edit</Button>
            </Link>

            <DeleteConfirmDialog item={item}>
              <Button variant={'outline'}>Delete</Button>
            </DeleteConfirmDialog>
          </span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
