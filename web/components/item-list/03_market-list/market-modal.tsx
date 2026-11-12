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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn/components/ui/dialog'
import { ITEM_CONDITION_LABELS } from '@/lib/constants/item-condition-labels'
import { ItemCondition } from '@/lib/enums/item-condition'
import { formatCurrency } from '@/lib/helpers/format-price'
import { useLoadingStore } from '@/lib/providers/loading-provider'
import useProfileStore from '@/lib/stores/profile-store'
import { Item } from '@/lib/types/item'
import { CircleUserIcon } from 'lucide-react'
import { ReactNode } from 'react'
import { toast } from 'sonner'

export default function MarketModal({
  children,
  item,
}: {
  children: ReactNode
  item: Item
}) {
  const { profile } = useProfileStore()
  const { setLoading } = useLoadingStore()
  const { setProps } = useChatStore()

  const handleChatButton = async () => {
    try {
      if (!profile) throw new Error()

      setLoading('Joining chat...')

      const room = await getRoom(item.alias)
      if (!room) throw new Error()

      setProps({ open: true, currentRoom: room })
    } catch (error) {
      console.error(error)
      toast('Something went wrong')
    } finally {
      setLoading()
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className='max-h-[96vh] overflow-auto max-sm:max-w-[96vw]'>
        <div className='flex flex-1 flex-col gap-4 overflow-auto p-2'>
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
                    <button className='font-semibold'>
                      {item.profile.handle}
                    </button>
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

            <div className='flex w-full items-center justify-center'>
              <div className='w-full'>
                <ItemImageCarousel imageUrls={item.imageUrls} rounded />
              </div>
            </div>
          </div>

          <div className='flex items-center justify-between gap-2'>
            <Button onClick={handleChatButton} disabled={!profile}>
              {profile ? 'Chat' : 'Sign in to Chat'}
            </Button>

            <span className='rounded-lg border p-2 font-semibold'>
              Offered at {formatCurrency(item.price.toString())}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
