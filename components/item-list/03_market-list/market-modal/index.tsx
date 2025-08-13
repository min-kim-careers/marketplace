import DetailSection from '@/components/item-list/03_market-list/market-modal/detail-section'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/shadcn/components/ui/dialog'
import { Item } from '@/lib/types/item'
import { ReactNode, useState } from 'react'

export default function MarketModal({
  children,
  item,
}: {
  children: ReactNode
  item: Item
}) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='max-h-[90vh] overflow-auto'>
        <DetailSection item={item} />
      </DialogContent>
    </Dialog>
  )
}
