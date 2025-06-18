'use client'

import { Button } from '@/components/shadcn/components/ui/button'
import { toUrlParams } from '@/lib/helpers/to-url-params'
import { APP_DATA } from '@/lib/constants/app-data'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import useProfileStore from '@/lib/stores/profile'
import Link from 'next/link'

export default function Landing() {
  const { profile } = useProfileStore()

  return (
    <div className='flex w-full flex-1 items-center justify-center'>
      <div className='flex w-3/4 flex-col items-center justify-center gap-8 sm:items-start'>
        <h1 className='text-4xl font-bold'>
          Welcome to the {APP_DATA.TITLE}!
        </h1>
        {profile && profile.handle && (
          <p>{`Hi there, ${profile.handle}!`}</p>
        )}

        <Link
          href={`${APP_ROUTES.MARKET.url}`}
          passHref
        >
          <Button>Browse the market</Button>
        </Link>
      </div>
    </div>
  )
}
