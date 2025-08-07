import Toolbar from '@/components/00_common/item-list/01_toolbar'
import PaginationTop from '@/components/00_common/item-list/02_pagination-top'
import ProfileListingsList from '@/components/00_common/item-list/03_profile-listings-list'
import PaginationBottom from '@/components/00_common/item-list/04_pagination-bottom'
import PageFallback from '@/components/00_common/page-fallback'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { ItemPageProvider } from '@/lib/providers/item-page-provider'
import { ItemPageParams } from '@/lib/types/item-page-params'
import { Suspense } from 'react'

export default function ProfileListing({ params }: { params: ItemPageParams }) {
  return (
    <div className='flex w-full flex-1 flex-col justify-between gap-2'>
      <ItemPageProvider
        props={{ params, route: APP_ROUTES.PROFILE_LISTINGS.href }}
      >
        <div className='flex w-full flex-1 flex-col gap-2'>
          <Toolbar />

          <div className='-mx-4 border-b' />

          <PaginationTop />
          <Suspense fallback={<PageFallback />}>
            <ProfileListingsList params={params} />
          </Suspense>
        </div>
        <PaginationBottom />
      </ItemPageProvider>
    </div>
  )
}
