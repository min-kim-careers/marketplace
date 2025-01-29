'use client'

import { ROUTES } from '@/constants/routes'
import useAuthStore from '@/store/auth-store'
import Link from 'next/link'
import ProfileIcon from './profile-icon'
import { Button } from '../shadcn/components/ui/button'

export default function Navbar() {
  const { profile } = useAuthStore()

  const LoggedIn = () => (
    <span className='flex items-center justify-between gap-4'>
      <Button>
        <Link
          href={{
            pathname: ROUTES.SEARCH,
            query: { page: '1' },
          }}
        >
          Browse
        </Link>
      </Button>
      <Button>
        <Link href={ROUTES.POST}>Post Ad</Link>
      </Button>
      <ProfileIcon />
    </span>
  )

  const LoggedOut = () => (
    <span className='flex gap-4'>
      <Link href={ROUTES.LOGIN}>
        <Button>Login</Button>
      </Link>
      <Link href={ROUTES.SIGNUP}>
        <Button>Signup</Button>
      </Link>
    </span>
  )

  return (
    <nav className='flex w-full items-center justify-between p-4 pb-2'>
      <Link
        href={ROUTES.HOME}
        className='text-2xl font-bold'
      >
        Marketplace
      </Link>

      {profile ? <LoggedIn /> : <LoggedOut />}
    </nav>
  )
}
