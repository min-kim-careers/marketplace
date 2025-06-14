import ItemCard from '@/components/02_main/market/00_common/item-card'
import { Item } from '@/lib/interfaces/item'

export default function ProfileListings({
  listings,
}: {
  listings: Item[]
}) {
  return (
    <div className='flex flex-1 items-center justify-start flex-col gap-2 w-full'>
      {listings.map((item: Item, i) => (
          <div className='w-full'>
            <ItemCard item={item} columns={1} />
          </div>
      ))}
    </div>
  )
}
