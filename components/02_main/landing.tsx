'use client'

import { Button } from '@/components/shadcn/components/ui/button'
import { META } from '@/lib/constants/meta'
import { ROUTES } from '@/lib/constants/routes'
import useProfileStore from '@/lib/stores/profile'
import Link from 'next/link'

export default function Landing() {
  const { profile } = useProfileStore()

  return (
    <div className='flex w-full flex-1 items-center justify-center'>
      <div className='flex w-3/4 flex-col items-center justify-center gap-8 sm:items-start'>
        <h1 className='text-4xl font-bold'>
          Welcome to the {META.APP_TITLE}!
        </h1>
        {profile && profile.handle && (
          <p>{`Hi there, ${profile.handle}!`}</p>
        )}

        <Link href={`${ROUTES.MARKET}?page=1`} passHref>
          <Button>Browse the market</Button>
        </Link>
      </div>
    </div>
  )
}
