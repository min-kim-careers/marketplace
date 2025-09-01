import Toolbar from '@/components/item-list/01_toolbar'
import PaginationTop from '@/components/item-list/02_pagination-top'
import MarketListServer from '@/components/item-list/03_market-list/server/market-list'
import PaginationBottom from '@/components/item-list/04_pagination-bottom'
import PageFallback from '@/components/page-fallback'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { ItemPageProvider } from '@/lib/providers/item-page-provider'
import { ItemPageParams } from '@/lib/types/item-page-params'
import { Suspense } from 'react'

export default function Market({ params }: { params: ItemPageParams }) {
  return (
    <div className='flex w-full flex-1 flex-col justify-between gap-2'>
      <ItemPageProvider props={{ params, route: APP_ROUTES.MARKET.href }}>
        <div className='flex w-full flex-1 flex-col gap-2'>
          <Toolbar />

          <div className='-mx-4 border-b' />

          <PaginationTop />
          <Suspense fallback={<PageFallback />}>
            <MarketListServer params={params} />
          </Suspense>
        </div>
        <PaginationBottom />
      </ItemPageProvider>
    </div>
  )
}
