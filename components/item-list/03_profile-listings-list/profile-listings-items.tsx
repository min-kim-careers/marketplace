'use client'

import ProfileListingsCard from '@/components/item-list/03_profile-listings-list/profile-listings-card'
import ProfileListingsModal from '@/components/item-list/03_profile-listings-list/profile-listings-modal'
import { useItemPageStore } from '@/lib/providers/item-page-provider'
import useLayoutStore from '@/lib/stores/layout-store'
import { Item } from '@/lib/types/item'
import { useEffect } from 'react'

export function ProfileListingItems({
  props,
}: {
  props: { items: Item[]; count: number }
}) {
  const { items, count } = props
  
  const { itemColumns } = useLayoutStore()
  const { setProps } = useItemPageStore()

  useEffect(() => setProps({ items, count }), [items, count])

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
        gridTemplateColumns: `repeat(${itemColumns}, minmax(0, 1fr))`,
      }}
    >
      {items.map((item: Item, i) => (
        <ProfileListingsModal key={i} item={item}>
          <div className='cursor-pointer'>
            <ProfileListingsCard item={item} columns={itemColumns} />
          </div>
        </ProfileListingsModal>
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
