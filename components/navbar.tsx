'use client'

import useAuthStore from '@/store/auth-store'
import Link from 'next/link'
import { Button } from './shadcn/components/ui/button'
import { toast } from './shadcn/hooks/use-toast'

export default function Navbar() {
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    toast({
      description: 'You have been logged out',
    })
  }

  const LoggedIn = () => (
    <span className='flex gap-4'>
      <Button>
        <Link href='/market'>Browse</Link>
      </Button>
      <Button>
        <Link href='/market/post'>Post Ad</Link>
      </Button>
      <Button onClick={handleLogout}>Logout</Button>
    </span>
  )

  const LoggedOut = () => (
    <span className='flex gap-4'>
      <Link href='/login'>
        <Button>Login</Button>
      </Link>
      <Link href='/signup'>
        <Button>Signup</Button>
      </Link>
    </span>
  )

  return (
    <nav className='flex w-full items-center justify-between p-4 pb-2'>
      <Link href='/' className='text-2xl font-bold'>
        Marketplace
      </Link>

      {user ? <LoggedIn /> : <LoggedOut />}
    </nav>
  )
}
