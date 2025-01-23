'use client'

import { Button } from '@/components/shadcn/components/ui/button'
import { ROUTES } from '@/constants/routes'
import useAuthStore from '@/store/auth-store'
import Link from 'next/link'

export default function Home() {
  const { profile } = useAuthStore()

  return (
    <div className='flex flex-col items-center gap-8 sm:items-start'>
      <h1 className='text-center text-4xl font-bold'>
        Welcome to the Marketplace!
      </h1>
      {profile ? (
        <p>Welcome, {profile.handle}!</p>
      ) : (
        <p>You are not logged in</p>
      )}
      <Link href={ROUTES.MARKET}>
        <Button>Browse parts</Button>
      </Link>
    </div>
  )
}
