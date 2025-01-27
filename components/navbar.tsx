'use client'

import useAuthStore from '@/store/auth-store'
import Link from 'next/link'
import { Button } from './shadcn/components/ui/button'
import { toast } from './shadcn/hooks/use-toast'
import { ROUTES } from '@/constants/routes'

export default function Navbar() {
  const { profile, actions } = useAuthStore()

  const handleLogout = () => {
    actions.logout()
    toast({
      description: 'You have been logged out',
    })
  }

  const LoggedIn = () => (
    <span className='flex gap-4'>
      <Button>
        <Link
          href={{
            pathname: ROUTES.SEARCH,
            query: { page: '1' },
          }}
        >
          Market
        </Link>
      </Button>
      <Button>
        <Link href={ROUTES.POST}>Post Ad</Link>
      </Button>
      <Button onClick={handleLogout}>Logout</Button>
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
