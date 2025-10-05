'use client'

import { Button } from '@/components/shadcn/components/ui/button'
import { APP_DATA } from '@/lib/constants/app-data'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import useProfileStore from '@/lib/stores/profile-store'
import Link from 'next/link'

export default function Landing() {
  const { profile } = useProfileStore()

  return (
    <div className='flex w-full flex-1 items-center justify-center'>
      <div className='flex w-3/4 flex-col items-center justify-center gap-10 text-center sm:items-start sm:text-left'>
        <div className='space-y-3'>
          <h1 className='text-4xl font-bold'>
            Welcome to the {APP_DATA.TITLE}!
          </h1>
          <p className='text-lg '>Built by Aussie PC enthusiasts for Aussie PC enthusiasts. Trade parts, share builds, save cash.</p>
        </div>

        {profile && (
          <p>
            Logged in as <span className='italic'>{profile.handle}</span>!
          </p>
        )}

        <Link href={`${APP_ROUTES.MARKET.href}`} passHref>
          <Button className='text-md'>Browse the market</Button>
        </Link>
      </div>
    </div>
  )
}
