'use client'

import Toolbar from '@/components/00_common/market-and-listings/01_toolbar'
import PaginationTop from '@/components/00_common/market-and-listings/02_pagination-top'
import MarketList from '@/components/00_common/market-and-listings/03_market-list'
import PaginationBottom from '@/components/00_common/market-and-listings/04_pagination-bottom'
import { Suspense } from 'react'

export default function Market() {
  return (
    <div className='flex w-full flex-1 flex-col justify-between gap-2'>
      <div className='flex w-full flex-1 flex-col gap-2'>
        <Toolbar />
        <PaginationTop />
        <Suspense fallback={<>Loading...</>}>
          <MarketList />
        </Suspense>
      </div>
      <PaginationBottom />
    </div>
  )
}
