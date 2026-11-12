'use client'

import MarketCard from '@/components/item-list/03_market-list/market-card'
import MarketModal from '@/components/item-list/03_market-list/market-modal'
import { cn } from '@/components/shadcn/lib/utils'
import { useIsMobile } from '@/lib/hooks/ui/use-is-mobile'
import { useItemPageContext } from '@/lib/providers/item-page-provider'
import useLayoutStore from '@/lib/stores/layout-store'
import { Item } from '@/lib/types/item'
import { useEffect } from 'react'

export function MarketList({
  props,
}: {
  props: { items: Item[]; count: number }
}) {
  const { items, count } = props
  const { setProps } = useItemPageContext()
  const { itemColumns } = useLayoutStore()
  const isMobile = useIsMobile()

  useEffect(() => setProps({ items, count }), [items, count])

  if (!items.length)
    return (
      <div className='flex flex-1 items-center justify-center text-black/50'>
        No results..
      </div>
    )

  return (
    <div
      className={cn(
        'grid w-full items-start gap-2',
        isMobile || itemColumns === 1 ? 'grid-cols-1' : 'grid-cols-3',
      )}
    >
      {items.map((item: Item, i: number) => (
        <MarketModal key={i} item={item}>
          <div className='cursor-pointer'>
            <MarketCard item={item} itemColumns={itemColumns} />
          </div>
        </MarketModal>
      ))}
    </div>
  )
}
