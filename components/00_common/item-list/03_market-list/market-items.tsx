'use client'

import MarketCard from '@/components/00_common/item-list/03_market-list/market-card'
import MarketModal from '@/components/00_common/item-list/03_market-list/market-modal'
import { useItemPageStore } from '@/lib/providers/item-page-provider'
import useLayoutStore from '@/lib/stores/layout-store'
import { Item } from '@/lib/types/item'
import { useEffect } from 'react'

export function MarketItems({
  items,
  count,
}: {
  items: Item[]
  count: number
}) {
  const { itemColumns } = useLayoutStore()
  const { setProps } = useItemPageStore()

  useEffect(() => setProps({ items, count }), [items, count])

  if (!items.length)
    return (
      <div className='flex flex-1 items-center justify-center text-black/50'>
        No results..
      </div>
    )

  return (
    <div
      className='grid w-full items-start gap-2'
      style={{
        gridTemplateColumns: `repeat(${itemColumns}, minmax(0, 1fr)`,
      }}
    >
      {items.map((item: Item, i: number) => (
        <MarketModal key={i} item={item}>
          <div className='cursor-pointer'>
            <MarketCard item={item} columns={itemColumns} />
          </div>
        </MarketModal>
      ))}
      <style jsx>{`
        @media (max-width: 640px) {
          div.grid {
            grid-template-columns: repeat(1, 1fr) !important;
          }
        }
      `}</style>
    </div>
  )
}
