import ItemPageFallback from '@/components/00_common/market-and-listings/00_common/fallback'
import Toolbar from '@/components/00_common/market-and-listings/01_toolbar'
import PaginationTop from '@/components/00_common/market-and-listings/02_pagination-top'
import MarketList from '@/components/00_common/market-and-listings/03_market-list'
import PaginationBottom from '@/components/00_common/market-and-listings/04_pagination-bottom'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { ItemPageProvider } from '@/lib/providers/item-page-provider'
import { ItemPageParams } from '@/lib/types/item-page-params'
import { Suspense } from 'react'

export default function Market({ params }: { params: ItemPageParams }) {
  return (
    <div className='flex w-full flex-1 flex-col justify-between gap-2'>
      <ItemPageProvider
        key={Date.now()}
        props={{ params, route: APP_ROUTES.MARKET.href }}
      >
        <div className='flex w-full flex-1 flex-col gap-2'>
          <Toolbar />
          <PaginationTop />
          <Suspense fallback={<ItemPageFallback />}>
            <MarketList params={params} />
          </Suspense>
        </div>
        <PaginationBottom />
      </ItemPageProvider>
    </div>
  )
}
