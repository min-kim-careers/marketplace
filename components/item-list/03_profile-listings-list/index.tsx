'use client'

import ProfileListingsCard from '@/components/item-list/03_profile-listings-list/profile-listings-card'
import ProfileListingsModal from '@/components/item-list/03_profile-listings-list/profile-listings-modal'
import { cn } from '@/components/shadcn/lib/utils'
import { useIsMobile } from '@/lib/hooks/ui/use-is-mobile'
import { useItemPageStore } from '@/lib/providers/item-page-provider'
import useLayoutStore from '@/lib/stores/layout-store'
import { Item } from '@/lib/types/item'
import { useEffect } from 'react'

export function ProfileListingsList({
  props,
}: {
  props: { items: Item[]; count: number }
}) {
  const { items, count } = props
  const { itemColumns } = useLayoutStore()
  const { setProps } = useItemPageStore()
  const isMobile = useIsMobile()

  useEffect(() => setProps({ items, count }), [items, count])

  if (!items.length)
    return (
      <div className='flex flex-1 items-center justify-center text-black/50'>
        No listings..
      </div>
    )

  return (
    <div
      className={cn(
        'grid w-full items-start gap-2',
        isMobile || itemColumns === 1 ? 'grid-cols-1' : 'grid-cols-3',
      )}
    >
      {items.map((item: Item, i) => (
        <ProfileListingsModal key={i} item={item}>
          <div className='cursor-pointer'>
            <ProfileListingsCard item={item} itemColumns={itemColumns} />
          </div>
        </ProfileListingsModal>
      ))}
    </div>
  )
}
