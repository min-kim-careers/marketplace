'use client'

import { APP_TITLE } from '@/lib/constants'
import { ROUTES } from '@/lib/constants/routes'
import useAuthStore from '@/lib/stores/auth'
import Link from 'next/link'
import { AuthGate } from '../00_common/auth-gate'
import AuthDialog from './auth-dialog'
import Nav from './nav'
import { Button } from '../shadcn/components/ui/button'

export default function Header() {
  const { user } = useAuthStore()

  return (
    <div className='flex w-full items-start justify-between pb-2'>
      <Link
        href={ROUTES.HOME}
        className='text-2xl font-bold'
      >
        {APP_TITLE}
      </Link>
      <span className='flex min-w-[10rem] items-center justify-center'>
        <AuthGate>
          {user ? (
            <Nav />
          ) : (
            <AuthDialog>
              <Button>Sign In / Sign Up</Button>
            </AuthDialog>
          )}
        </AuthGate>
      </span>
    </div>
  )
}
