import ProfileListingsCard from '@/components/00_common/market-and-listings/03_profile-listings-list/profile-listings-card'
import ProfileListingsModal from '@/components/00_common/market-and-listings/03_profile-listings-list/profile-listings-modal'
import { IItem } from '@/lib/interfaces/item'
import { useItemPageStore } from '@/lib/providers/item-page-provider'
import  useLayoutStore  from '@/lib/stores/layout-store'

export default function ProfileListingsList() {
  const { itemColumns: columns } = useLayoutStore()
  const items = useItemPageStore((store) => store.items)

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
      {items.map((item: IItem, i) => (
        <ProfileListingsModal key={i} item={item} index={i}>
          <div className='cursor-pointer'>
            <ProfileListingsCard item={item} columns={columns} />
          </div>
        </ProfileListingsModal>
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
