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
import { Item } from '@/lib/interfaces/items'
import { ReactNode } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '@/components/shadcn/components/ui/button'

export default function ItemModal({
  children,
  item,
}: {
  children: ReactNode
  item: Item
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader className='flex-row justify-between'>
          <span className='flex flex-col justify-around'>
            <DialogTitle className='space-x-2'>
              <span className='italic opacity-50'>
                {item.condition}
              </span>
              <span>{item.name}</span>
            </DialogTitle>
            <DialogDescription>
              <div className='my-2'>
                Updated{' '}
                {formatDistanceToNow(
                  item.updatedAt.toLocaleString(),
                  { addSuffix: true },
                )}{' '}
                by{' '}
                <span className='space-x-2'>
                  <button className='font-semibold'>
                    {item.userHandle}
                  </button>
                </span>
              </div>
              <button className='text-sm italic text-black/40'>
                Report this user
              </button>
            </DialogDescription>
          </span>
          <span className='mr-6 flex flex-1 items-center justify-end'>
            <button className='flex h-14 w-14 items-center justify-center rounded-full border-[1px] border-gray-200 bg-gray-100 text-black/50'>
              P
            </button>
          </span>
        </DialogHeader>
        <div className='flex min-h-[50vh] flex-col gap-4'>
          <div className=''>{item.description}</div>
          <div className='flex flex-1 items-center justify-center rounded-lg border-[1px] border-gray-200 bg-gray-100 italic text-black/50'>
            No Image
          </div>
        </div>

        <DialogFooter className='items-center sm:justify-between'>
          <span className='font-semibold'>
            Offered at ${Math.round(item.price)}
          </span>
          <Button>Chat with {item.userHandle}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
