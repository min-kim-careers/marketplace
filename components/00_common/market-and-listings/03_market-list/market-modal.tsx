import ItemImagePreview from '@/components/00_common/item-image-preview'
import Spinner from '@/components/00_common/spinner'
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
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { ITEM_CONDITION_LABELS } from '@/lib/constants/item-condition-labels'
import { ItemCondition } from '@/lib/enums/item-condition'
import { formatCurrency } from '@/lib/helpers/format-price'
import { encodeParams } from '@/lib/helpers/encode-params'
import { IItem } from '@/lib/interfaces/item'
import useProfileStore from '@/lib/stores/profile-store'
import { formatDistanceToNow } from 'date-fns'
import { CircleUserIcon } from 'lucide-react'
import Link from 'next/link'
import { ReactNode, useEffect, useState } from 'react'

export default function MarketModal({
  children,
  item,
}: {
  children: ReactNode
  item: IItem
}) {
  const { profile } = useProfileStore()
  const [open, setOpen] = useState(false)
  const [chatSession, setChatSession] = useState<
    string | null
  >(null)

  useEffect(() => {
    const fetchParams = async () => {
      if (profile && open) {
        setChatSession(
          await encodeParams(
            {
              seller: item.profileHandle,
              item: item.id,
              buyer: profile.handle,
            },
            'session',
          ),
        )
      }
    }

    fetchParams()
  }, [item, profile, open])

  const updatedAt = () =>
    formatDistanceToNow(item.updatedAt.toLocaleString(), {
      addSuffix: true,
    })

  const renderContent = () => (
    <>
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
        <span className='flex flex-1 items-center justify-end'>
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
        <Link
          href={`${APP_ROUTES.CHAT.href}?${chatSession}`}
        >
          <Button>Chat with {item.profileHandle}</Button>
        </Link>
      </DialogFooter>
    </>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='max-h-[90vh] min-h-[50vh] overflow-auto'>
        {!chatSession ? (
          <DialogTitle className='flex items-center justify-center'>
            <Spinner />
          </DialogTitle>
        ) : (
          renderContent()
        )}
      </DialogContent>
    </Dialog>
  )
}
