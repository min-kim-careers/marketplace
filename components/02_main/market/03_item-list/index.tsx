import ItemCard from '@/components/02_main/market/00_common/item-card'
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
        <ItemCard key={i} item={item} columns={columns} />
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
