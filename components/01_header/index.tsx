'use client'

import { APP_TITLE } from '@/lib/constants'
import { ROUTES } from '@/lib/constants/routes'
import useAuthStore from '@/lib/stores/auth'
import Link from 'next/link'
import { Button } from '../shadcn/components/ui/button'
import NavBar from './nav-bar'

export default function Header() {
  const { profile } = useAuthStore()

  return (
    <div className='flex w-full items-start justify-between pb-2'>
      <Link
        href={ROUTES.HOME}
        className='text-2xl font-bold'
      >
        {APP_TITLE}
      </Link>
      <span className='flex min-w-[10rem] items-center justify-center'>
        {profile ? (
          <NavBar />
        ) : (
          <Button>Sign in/Sign up with Google</Button>
        )}
      </span>
    </div>
  )
}
