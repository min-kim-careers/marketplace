import ItemImagePreview from '@/components/00_common/item-image-preview'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/shadcn/components/ui/avatar'
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
import { FETCH_ROOM_ID } from '@/lib/clients/rooms'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { ITEM_CONDITION_LABELS } from '@/lib/constants/item-condition-labels'
import { ItemCondition } from '@/lib/enums/item-condition'
import { formatItemDate } from '@/lib/helpers/format-item-date'
import { formatCurrency } from '@/lib/helpers/format-price'
import { Item } from '@/lib/types/item'
import { CircleUserIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'

export default function MarketModal({
  children,
  item,
}: {
  children: ReactNode
  item: Item
}) {
  const router = useRouter()

  const handleChatButton = async () => {
    try {
      const roomId = await FETCH_ROOM_ID(item.id, item.profileHandle)
      router.replace(`${APP_ROUTES.CHAT.href}/${roomId}`)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='max-h-[90vh] overflow-auto'>
        <DialogHeader className='flex-row'>
          <span className='flex flex-[9] flex-col gap-3'>
            <DialogTitle className='space-x-2'>
              <span className='italic opacity-50'>
                {ITEM_CONDITION_LABELS[item.condition as ItemCondition]}
              </span>
              <span>{item.name}</span>
            </DialogTitle>
            <DialogDescription className='flex gap-2'>
              <span>
                <span>{`Updated ${formatItemDate(item.updatedAt)} by `}</span>
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

          <span className='flex flex-1 items-start justify-center pr-2'>
            <Avatar>
              <AvatarImage src={''} />
              <AvatarFallback>
                <CircleUserIcon className='h-full w-full' />
              </AvatarFallback>
            </Avatar>
          </span>
        </DialogHeader>

        <div className='flex flex-1 flex-col gap-4'>
          <div className='flex-1'>{item.description}</div>

          <div className='relative flex-1 rounded'>
            <ItemImagePreview imageUrls={item.imageUrls} />
          </div>
        </div>

        <DialogFooter className='items-center sm:justify-between'>
          <span className='font-semibold'>
            Offered at {formatCurrency(item.price.toString())}
          </span>
          <Button onClick={handleChatButton}>
            Chat with {item.profileHandle}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
