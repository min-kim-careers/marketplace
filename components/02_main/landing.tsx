'use client'

import { Button } from '@/components/shadcn/components/ui/button'
import { APP_TITLE } from '@/lib/constants'
import { ROUTES } from '@/lib/constants/routes'
import useAuthStore from '@/lib/stores/auth'
import Link from 'next/link'

export default function Landing() {
  const { profile } = useAuthStore()

  return (
    <div className='flex flex-1 justify-center items-center w-full'>
      <div className='flex w-3/4 flex-col items-center justify-center gap-8 sm:items-start'>
        <h1 className='text-4xl font-bold'>
          Welcome to the {APP_TITLE}!
        </h1>
        {profile ? (
          <p>Welcome, {profile.handle}!</p>
        ) : (
          <p>You are not logged in</p>
        )}
        <Link href={ROUTES.MARKET} passHref>
          <Button>Browse</Button>
        </Link>
      </div>
    </div>
  )
}
