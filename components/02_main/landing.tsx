'use client'

import { Button } from '@/components/shadcn/components/ui/button'
import { APP_TITLE } from '@/lib/constants'
import { ROUTES } from '@/lib/constants/routes'
import useAuthStore from '@/lib/stores/auth'
import Link from 'next/link'
import { AuthGate } from '../ui/auth-gate'

export default function Landing() {
  const { profile } = useAuthStore()

  return (
    <div className='flex w-full flex-1 items-center justify-center'>
      <div className='flex w-3/4 flex-col items-center justify-center gap-8 sm:items-start'>
        <h1 className='text-4xl font-bold'>
          Welcome to the {APP_TITLE}!
        </h1>
        <AuthGate>
          {profile ? (
            <p>Welcome, {profile.handle}!</p>
          ) : (
            <p>You are not logged in</p>
          )}
        </AuthGate>

        <Link href={ROUTES.MARKET} passHref>
          <Button>Browse</Button>
        </Link>
      </div>
    </div>
  )
}
