import ListingsCard from '@/components/02_content/main/03_listings-list/listings-card'
import ListingsModal from '@/components/02_content/main/03_listings-list/listings-modal'
import { Item } from '@/lib/interfaces/item'
import { useItemPageContext } from '@/lib/providers/item-page-provider'
import  useLayoutStore  from '@/lib/stores/layout-store'

export default function ListingsItemList() {
  const { columns } = useLayoutStore()
  const { items } = useItemPageContext()

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
        <ListingsModal key={i} item={item} index={i}>
          <div className='cursor-pointer'>
            <ListingsCard item={item} columns={columns} />
          </div>
        </ListingsModal>
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
