'use client'

import { APP_TITLE } from '@/lib/constants'
import { ROUTES } from '@/lib/constants/routes'
import useAuthStore from '@/lib/stores/auth'
import Link from 'next/link'
import { Button } from '../shadcn/components/ui/button'
import AuthModal from './auth-modal'
import Nav from './nav'

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
          <Nav />
        ) : (
          <AuthModal>
            <Button>Sign In / Sign Up</Button>
          </AuthModal>
        )}
      </span>
    </div>
  )
}
