'use client'

import useAuthStore from '@/store/auth-store'
import Link from 'next/link'
import { AuthDialog } from './auth-dialog'
import { Button } from './shadcn/components/ui/button'
import { toast } from './shadcn/hooks/use-toast'

export default function NavBar() {
  const { user: user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    toast({
      description: 'You have been logged out',
    })
  }

  const LoggedIn = () => (
    <span className='flex gap-4'>
      <Button>Post Ad</Button>
      <Button onClick={handleLogout}>Logout</Button>
    </span>
  )

  const LoggedOut = () => (
    <span>
      <AuthDialog />
    </span>
  )

  return (
    <nav className='flex w-full justify-between p-4 pb-2'>
      <Link href='/' className='text-2xl font-bold'>
        Marketplace
      </Link>

      <span className='flex gap-4'>
        {user ? <LoggedIn /> : <LoggedOut />}
      </span>
    </nav>
  )
}
