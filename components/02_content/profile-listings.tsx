'use client'

import Toolbar from '@/components/00_common/market-and-listings/01_toolbar'
import PaginationTop from '@/components/00_common/market-and-listings/02_pagination-top'
import ProfileListingsList from '@/components/00_common/market-and-listings/03_profile-listings-list'
import PaginationBottom from '@/components/00_common/market-and-listings/04_pagination-bottom'

export default function ProfileListing() {
  return (
    <div className='flex w-full flex-1 flex-col justify-between gap-2'>
      <div className='flex w-full flex-1 flex-col gap-2'>
        <Toolbar />
        <PaginationTop />
        <ProfileListingsList />
      </div>
      <PaginationBottom />
    </div>
  )
}
