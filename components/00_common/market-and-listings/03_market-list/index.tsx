import MarketCard from '@/components/00_common/market-and-listings/03_market-list/market-card'
import MarketModal from '@/components/00_common/market-and-listings/03_market-list/market-modal'
import { Item } from '@/lib/types/item'
import { useItemPageStore } from '@/lib/providers/item-page-provider'
import  useLayoutStore  from '@/lib/stores/layout-store'

export default function MarketList() {
  const { itemColumns: columns } = useLayoutStore()
  const { items } = useItemPageStore()


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
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }}
    >
      {items.map((item: Item, i: number) => (
        <MarketModal key={i} item={item}>
          <div className='cursor-pointer'>
            <MarketCard item={item} columns={columns} />
          </div>
        </MarketModal>
      ))}
      <style jsx>{`
        @media (max-width: 640px) {
          div.grid {
            grid-template-columns: repeat(
              1,
              1fr
            ) !important;
          }
        }
      `}</style>
    </div>
  )
}
