import ItemCard from '@/components/02_main/profile-listings/03_item-list/item-card'
import ItemModal from '@/components/02_main/profile-listings/03_item-list/item-modal'
import { Item } from '@/lib/interfaces/item'
import  useLayoutStore  from '@/lib/stores/layout'
import useListingsStore from '@/lib/stores/listing'

export default function ItemList() {
  const { columns } = useLayoutStore()
  const { items } = useListingsStore()

  if (!items.length)
    return (
      <div className='flex flex-1 items-center justify-center text-black/50'>
        No listings..
      </div>
    )

  return (
    <div
      className='grid w-full items-start gap-2'
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
