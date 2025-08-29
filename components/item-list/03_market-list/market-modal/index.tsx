import DetailSection from '@/components/item-list/03_market-list/market-modal/detail-section'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/shadcn/components/ui/dialog'
import { Item } from '@/lib/types/item'
import { ReactNode } from 'react'

export default function MarketModal({
  children,
  item,
}: {
  children: ReactNode
  item: Item
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='max-h-[90vh] min-h-[80vh] max-w-[50vw] overflow-auto max-sm:max-w-[95vw]'>
        <div className='flex flex-1 flex-col gap-2 overflow-auto p-2'>
          <DetailSection className='flex flex-1 p-2' item={item} />

          {/* <span className='mx-2 border-b' />

          <MessageSection className='flex flex-1 p-2' /> */}
        </div>
      </DialogContent>
    </Dialog>
  )
}
