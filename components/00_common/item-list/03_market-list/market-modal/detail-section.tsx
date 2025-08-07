import ItemImagePreview from '@/components/00_common/item-image-preview'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/shadcn/components/ui/avatar'
import {
  DialogDescription,
  DialogTitle
} from '@/components/shadcn/components/ui/dialog'
import { ITEM_CONDITION_LABELS } from '@/lib/constants/item-condition-labels'
import { ItemCondition } from '@/lib/enums/item-condition'
import { formatCurrency } from '@/lib/helpers/format-price'
import { Item } from '@/lib/types/item'
import { CircleUserIcon } from 'lucide-react'

export default function DetailSection({ item }: { item: Item }) {
  return (
    <div>
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
              <span>{`Updated ${item.updatedAtLabel} by `}</span>
              <span>
                <button className='font-semibold'>{item.profileHandle}</button>
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
      </div>
      <div className='flex flex-1 flex-col gap-4'>
        <div className='flex-1'>{item.description}</div>
        <div className='relative flex-1 rounded'>
          <ItemImagePreview imageUrls={item.imageUrls} />
        </div>
      </div>
      <div className='flex items-center justify-end'>
        <span className='font-semibold border rounded-lg p-2'>
          Offered at {formatCurrency(item.price.toString())}
        </span>
      </div>
    </div>
  )
}
