import { getRoom } from '@/api'
import useChatStore from '@/chat/stores/chat-store'
import DateFormatter from '@/components/date-formatter'
import ItemImageCarousel from '@/components/item-image-carousel'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/shadcn/components/ui/avatar'
import { Button } from '@/components/shadcn/components/ui/button'
import {
  DialogDescription,
  DialogTitle,
} from '@/components/shadcn/components/ui/dialog'
import { cn } from '@/components/shadcn/lib/utils'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { ITEM_CONDITION_LABELS } from '@/lib/constants/item-condition-labels'
import { ItemCondition } from '@/lib/enums/item-condition'
import { formatCurrency } from '@/lib/helpers/format-price'
import { useLoadingStore } from '@/lib/providers/loading-provider'
import { Item } from '@/lib/types/item'
import { CircleUserIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function DetailSection({
  item,
  className,
}: {
  item: Item
  className?: string
}) {
  const router = useRouter()
  const { setLoading } = useLoadingStore()
  const { setCurrentRoom } = useChatStore()

  const handleChatButton = async () => {
    try {
      setLoading('Joining chat...')

      const room = await getRoom(item.alias)
      if (!room) throw new Error()
      setCurrentRoom(room)
      router.push(APP_ROUTES.CHAT.href)
    } catch (error) {
      console.error(error)
      toast('Something went wrong')
    } finally {
      setLoading()
    }
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className='flex flex-row'>
        <span className='flex flex-[9] flex-col gap-3'>
          <DialogTitle className='space-x-2'>
            <span className='italic opacity-50'>
              {ITEM_CONDITION_LABELS[item.condition as ItemCondition]}
            </span>
            <span>{item.name}</span>
          </DialogTitle>
          <DialogDescription className='flex gap-2'>
            <span>
              <span>
                Updated <DateFormatter date={item.updatedAt} /> by{' '}
                <button className='font-semibold'>{item.profile.handle}</button>
              </span>
            </span>
          </DialogDescription>
        </span>

        <span className='flex flex-1 items-start justify-center pr-2'>
          <Avatar>
            <AvatarImage src={item.profile.avatarUrl} />
            <AvatarFallback>
              <CircleUserIcon className='h-full w-full' />
            </AvatarFallback>
          </Avatar>
        </span>
      </div>

      <div className='flex flex-1 flex-col gap-4'>
        <div className='flex-1'>{item.description}</div>
        <div className='relative flex-1 rounded'>
          <ItemImageCarousel imageUrls={item.imageUrls} className='rounded' />
        </div>
      </div>

      <div className='flex items-center justify-between gap-2'>
        <Button onClick={handleChatButton}>Chat</Button>

        <span className='rounded-lg border p-2 font-semibold'>
          Offered at {formatCurrency(item.price.toString())}
        </span>
      </div>
    </div>
  )
}
