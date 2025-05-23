import ItemCard from '@/components/02_main/market/00_common/item-card'
import ItemModal from '@/components/02_main/market/00_common/item-modal'
import { Button } from '@/components/shadcn/components/ui/button'
import { Item } from '@/lib/interfaces/items'
import { useLayoutStore } from '@/lib/stores/layout'
import { useMarketStore } from '@/lib/stores/market'

export default function ItemList() {
  const { columns } = useLayoutStore()
  const { items } = useMarketStore()

  return (
    <div
      className='grid w-full flex-1 items-start gap-2'
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }}
    >
      {items.map((item: Item, i) => (
        <ItemModal key={i} item={item}>
          <div className='cursor-pointer'>
            <ItemCard item={item} columns={columns} />
          </div>
        </ItemModal>
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
