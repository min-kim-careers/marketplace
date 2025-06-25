'use client'

import Toolbar from '@/components/02_content/main/01_toolbar'
import PaginationTop from '@/components/02_content/main/02_pagination-top'
import MarketItemList from '@/components/02_content/main/03_market-list'
import PaginationBottom from '@/components/02_content/main/04_pagination-bottom'

export default function Market() {
  return (
    <div className='flex w-full flex-1 flex-col justify-between gap-2'>
      <div className='flex w-full flex-1 flex-col gap-2'>
        <Toolbar />
        <PaginationTop />
        <MarketItemList />
      </div>
      <PaginationBottom />
    </div>
  )
}
