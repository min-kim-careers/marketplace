import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn/components/ui/dialog'
import { Item } from '@/lib/interfaces/item'
import { ReactNode } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '@/components/shadcn/components/ui/button'
import ItemImagePreview from '@/components/02_main/market/00_common/item-image-preview'
import { ITEM_CONDITION_LABELS } from '@/lib/constants/item-condition-labels'
import { ItemCondition } from '@/lib/enums/item-condition'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/shadcn/components/ui/avatar'
import { CircleUserIcon } from 'lucide-react'

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

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='max-h-[90vh] min-h-[80vh] overflow-auto'>
        <DialogHeader className='flex-row justify-between'>
          <span className='flex flex-col justify-around'>
            <DialogTitle className='space-x-2'>
              <span className='italic opacity-50'>
                {
                  ITEM_CONDITION_LABELS[
                    item.condition as ItemCondition
                  ]
                }
              </span>
              <span>{item.name}</span>
            </DialogTitle>
            <DialogDescription className='flex gap-2'>
              <span>
                <span>{`Updated ${updatedAt()} by `}</span>
                <span>
                  <button className='font-semibold'>
                    {item.profileHandle}
                  </button>
                </span>
              </span>
              <button className='text-sm italic text-black/40'>
                Report this user
              </button>
            </DialogDescription>
          </span>
          <span className='mr-6 flex flex-1 items-center justify-end'>
            <Avatar>
              <AvatarImage src={''} />
              <AvatarFallback>
                <CircleUserIcon className='h-full w-full' />
              </AvatarFallback>
            </Avatar>
          </span>
        </DialogHeader>

        <div className='flex flex-1 flex-col'>
          <div className='flex-1'>{item.description}</div>
          <div className='relative flex-1 rounded shadow'>
            {item.imageUrls.length ? <ItemImagePreview imageUrls={item.imageUrls} /> : <p>None</p>}
          </div>
        </div>

        <DialogFooter className='items-center sm:justify-between'>
          <span className='font-semibold'>
            Offered at ${Math.round(item.price)}
          </span>
          <Button>Chat with {item.profileHandle}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
