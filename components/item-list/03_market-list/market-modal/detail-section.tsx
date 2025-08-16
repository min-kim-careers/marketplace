import { getRoomId } from '@/api/service/chat'
import DateFormatter from '@/components/date-formatter'
import ItemImagePreview from '@/components/item-image-preview'
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
import { ITEM_CONDITION_LABELS } from '@/lib/constants/item-condition-labels'
import { ItemCondition } from '@/lib/enums/item-condition'
import { formatCurrency } from '@/lib/helpers/format-price'
import { useChatContext } from '@/lib/providers/chat-provider'
import { useLoadingStore } from '@/lib/providers/loading-provider'
import { Item } from '@/lib/types/item'
import { CircleUserIcon } from 'lucide-react'
import { toast } from 'sonner'

export default function DetailSection({ item }: { item: Item }) {
  const { setRoomId } = useChatContext()
  const { setLoading } = useLoadingStore()

  const handleChatButton = async () => {
    try {
      setLoading('Loading chat room...')
      const roomId = await getRoomId(item.profile.handle, item.id)
      if (!roomId) throw new Error()
      setRoomId(roomId)
    } catch (error) {
      toast('Something went wrong')
    } finally {
      setLoading()
    }
  }

  return (
    <div className='flex flex-col gap-2'>
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
          <ItemImagePreview imageUrls={item.imageUrls} />
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
