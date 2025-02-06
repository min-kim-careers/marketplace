'use client'

import { Button } from '@/components/shadcn/components/ui/button'
import { ROUTES } from '@/constants/routes'
import useAuthStore from '@/store/auth-store'
import Link from 'next/link'

export default function Landing() {
  const { profile } = useAuthStore()

  return (
    <div className='flex flex-1 justify-center items-center'>
      <div className='flex w-3/4 flex-col items-center justify-center gap-8 sm:items-start'>
        <h1 className='text-4xl font-bold'>
          Welcome to the Marketplace!
        </h1>
        {profile ? (
          <p>Welcome, {profile.handle}!</p>
        ) : (
          <p>You are not logged in</p>
        )}
        <Link href={ROUTES.SEARCH}>
          <Button>Browse market</Button>
        </Link>
      </div>
    </div>
  )
}
