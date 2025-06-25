'use client'

import Toolbar from '@/components/02_content/main/01_toolbar'
import PaginationTop from '@/components/02_content/main/02_pagination-top'
import ListingsItemList from '@/components/02_content/main/03_listings-list'
import PaginationBottom from '@/components/02_content/main/04_pagination-bottom'

export default function ProfileListing() {
  return (
    <div className='flex w-full flex-1 flex-col justify-between gap-2'>
      <div className='flex w-full flex-1 flex-col gap-2'>
        <Toolbar />
        <PaginationTop />
        <ListingsItemList />
      </div>
      <PaginationBottom />
    </div>
  )
}
