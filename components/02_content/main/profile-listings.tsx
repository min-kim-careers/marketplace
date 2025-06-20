'use client'

import { Item } from '@/lib/interfaces/item'

import ListingsItemList from '@/components/02_content/main/03_listings-list'
import Toolbar from '@/components/02_content/main/01_toolbar'
import PaginationTop from '@/components/02_content/main/02_pagination-top'
import PaginationBottom from '@/components/02_content/main/04_pagination-bottom'
import { ItemPageParams } from '@/lib/interfaces/item-page-params'
import { ItemPageProvider } from '@/lib/providers/item-page-provider'
import { APP_ROUTES } from '@/lib/constants/app-routes'

export default function ProfileListings({
  items,
  count,
  params,
}: {
  items: Item[]
  count: number
  params: ItemPageParams
}) {
  return (
    <ItemPageProvider
      value={{
        items,
        count,
        params,
        route: APP_ROUTES.PROFILE_LISTINGS.href,
      }}
    >
      <div className='flex w-full flex-1 flex-col justify-between gap-2'>
        <div className='flex w-full flex-1 flex-col gap-2'>
          <Toolbar />
          <PaginationTop />
          <ListingsItemList />
        </div>
        <PaginationBottom />
      </div>
    </ItemPageProvider>
  )
}
